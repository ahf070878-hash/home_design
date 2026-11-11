import { spawn } from "node:child_process";
import { resolve } from "node:path";

const [command = "dev", port = "3015", surface = "public"] = process.argv.slice(2);
if (!new Set(["dev", "build", "start"]).has(command)) throw new Error(`Perintah Next.js tidak didukung: ${command}`);
if (!new Set(["public", "admin"]).has(surface)) throw new Error(`Permukaan aplikasi tidak didukung: ${surface}`);

const nextCli = resolve("node_modules", "next", "dist", "bin", "next");
const args = [nextCli, command];
if (command !== "build") args.push("--port", port);

const child = spawn(process.execPath, args, {
  stdio: "inherit",
  env: { ...process.env, APP_SURFACE: surface },
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
