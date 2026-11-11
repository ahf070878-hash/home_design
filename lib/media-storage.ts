import { Storage } from "@google-cloud/storage";
import { mkdir, readFile, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const LOCAL_DIRECTORY = join(process.cwd(), "public", "uploads", "media");
const LOCAL_METADATA_FILE = join(LOCAL_DIRECTORY, ".media-library.json");
const GCS_PREFIX = "media/";

type MediaMetadata = Record<string, { displayName: string }>;

export type MediaAsset = {
  fileName: string;
  displayName: string;
  url: string;
  kind: "image" | "video";
  size: number;
  modifiedAt: string;
};

function bucketName() {
  return process.env.GCS_MEDIA_BUCKET?.trim() || null;
}

function storageBucket() {
  const name = bucketName();
  return name ? new Storage().bucket(name) : null;
}

export function isSafeMediaFileName(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 255 && !value.startsWith(".") && basename(value) === value;
}

export function mediaUrl(fileName: string) {
  return `/api/media/${encodeURIComponent(fileName)}`;
}

export function mediaKind(fileName: string): "image" | "video" {
  return [".mp4", ".webm", ".mov"].includes(extname(fileName).toLowerCase()) ? "video" : "image";
}

async function readLocalMetadata(): Promise<MediaMetadata> {
  try {
    const value: unknown = JSON.parse(await readFile(LOCAL_METADATA_FILE, "utf8"));
    return value && typeof value === "object" && !Array.isArray(value) ? value as MediaMetadata : {};
  } catch {
    return {};
  }
}

async function writeLocalMetadata(metadata: MediaMetadata) {
  await mkdir(LOCAL_DIRECTORY, { recursive: true });
  await writeFile(LOCAL_METADATA_FILE, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
}

export async function listMediaAssets(): Promise<MediaAsset[]> {
  const bucket = storageBucket();
  if (bucket) {
    const [files] = await bucket.getFiles({ prefix: GCS_PREFIX });
    const assets = await Promise.all(files.filter((file) => file.name !== GCS_PREFIX).map(async (file) => {
      const [metadata] = await file.getMetadata();
      const fileName = basename(file.name);
      const storedDisplayName = metadata.metadata?.displayName;
      return {
        fileName,
        displayName: typeof storedDisplayName === "string" && storedDisplayName ? storedDisplayName : fileName,
        url: mediaUrl(fileName),
        kind: mediaKind(fileName),
        size: Number(metadata.size ?? 0),
        modifiedAt: metadata.updated || new Date(0).toISOString(),
      } satisfies MediaAsset;
    }));
    return assets.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
  }

  await mkdir(LOCAL_DIRECTORY, { recursive: true });
  const names = await readdir(LOCAL_DIRECTORY);
  const metadata = await readLocalMetadata();
  const assets = await Promise.all(names.filter((name) => !name.startsWith(".")).map(async (fileName) => {
    const details = await stat(join(LOCAL_DIRECTORY, fileName));
    return {
      fileName,
      displayName: metadata[fileName]?.displayName ?? fileName,
      url: mediaUrl(fileName),
      kind: mediaKind(fileName),
      size: details.size,
      modifiedAt: details.mtime.toISOString(),
    } satisfies MediaAsset;
  }));
  return assets.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
}

export async function writeMediaAsset(fileName: string, content: Buffer, contentType: string, displayName: string) {
  if (!isSafeMediaFileName(fileName)) throw new Error("INVALID_FILE_NAME");
  const bucket = storageBucket();
  if (bucket) {
    await bucket.file(`${GCS_PREFIX}${fileName}`).save(content, {
      resumable: false,
      metadata: { contentType, cacheControl: "public, max-age=3600", metadata: { displayName } },
      preconditionOpts: { ifGenerationMatch: 0 },
    });
    return mediaUrl(fileName);
  }

  await mkdir(LOCAL_DIRECTORY, { recursive: true });
  await writeFile(join(LOCAL_DIRECTORY, fileName), content, { flag: "wx" });
  const metadata = await readLocalMetadata();
  metadata[fileName] = { displayName };
  await writeLocalMetadata(metadata);
  return mediaUrl(fileName);
}

export async function updateMediaDisplayName(fileName: string, displayName: string) {
  const bucket = storageBucket();
  if (bucket) {
    const file = bucket.file(`${GCS_PREFIX}${fileName}`);
    const [exists] = await file.exists();
    if (!exists) throw new Error("NOT_FOUND");
    await file.setMetadata({ metadata: { displayName } });
    return;
  }
  await stat(join(LOCAL_DIRECTORY, fileName));
  const metadata = await readLocalMetadata();
  metadata[fileName] = { displayName };
  await writeLocalMetadata(metadata);
}

export async function mediaAssetExists(fileName: string) {
  const bucket = storageBucket();
  if (bucket) return (await bucket.file(`${GCS_PREFIX}${fileName}`).exists())[0];
  return stat(join(LOCAL_DIRECTORY, fileName)).then((details) => details.isFile()).catch(() => false);
}

export async function readMediaAsset(fileName: string) {
  const bucket = storageBucket();
  if (bucket) {
    const file = bucket.file(`${GCS_PREFIX}${fileName}`);
    const [[content], [metadata]] = await Promise.all([file.download(), file.getMetadata()]);
    return { content, contentType: metadata.contentType || "application/octet-stream" };
  }
  return { content: await readFile(join(LOCAL_DIRECTORY, fileName)), contentType: contentTypeFromExtension(fileName) };
}

export async function deleteMediaAsset(fileName: string) {
  const bucket = storageBucket();
  if (bucket) {
    await bucket.file(`${GCS_PREFIX}${fileName}`).delete();
    return;
  }
  await unlink(join(LOCAL_DIRECTORY, fileName));
  const metadata = await readLocalMetadata();
  delete metadata[fileName];
  await writeLocalMetadata(metadata);
}

function contentTypeFromExtension(fileName: string) {
  return new Map([
    [".jpg", "image/jpeg"], [".jpeg", "image/jpeg"], [".png", "image/png"], [".webp", "image/webp"],
    [".avif", "image/avif"], [".gif", "image/gif"], [".mp4", "video/mp4"], [".webm", "video/webm"], [".mov", "video/quicktime"],
  ]).get(extname(fileName).toLowerCase()) || "application/octet-stream";
}
