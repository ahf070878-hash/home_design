export type Design = {
  id: string; name: string; type: number; style: string; width: number; length: number;
  floors: number; bedrooms: number; bathrooms: number; price: number; baseRab: number;
  image: string; mediaPackageName?: string | null; galleryImages?: string[];
  facadeVariants: string[]; layoutVariants: string[];
};

export type MaterialProduct = {
  id: string; category: MaterialCategory; brand: string; name: string; unit: string;
  unitPrice: number; discount: number; cities: string[]; packageImage: string;
  applicationImage: string; applicationKind: "render" | "diagram";
};

export type MaterialCategory = "Semen & Beton" | "Atap" | "Keramik & Saniter" | "Cat" | "Pipa & Elektrikal";

const houseImages = [
  "photo-1600585154340-be6161a56a0c", "photo-1600596542815-ffad4c1539a9",
  "photo-1512917774080-9991f1c4c750", "photo-1600566753190-17f0baa2a6c3",
  "photo-1600607687939-ce8a6c25118c", "photo-1600047509807-ba8f99d2cdde",
  "photo-1600607687920-4e2a09cf159d", "photo-1600565193348-f74bd3c7ccdf",
];

const designSpecs = [
  [36,"Nara Compact","Tropis",6,10,1,2,1],[36,"Sora Courtyard","Japandi",6,12,1,2,1],
  [45,"Teras Teduh","Tropis",7,12,1,2,2],[45,"Kota Rapi","Minimalis",6,14,2,3,2],
  [50,"Laras Split","Kontemporer",7,14,2,3,2],[54,"Kayu Pagi","Nusantara",8,12,1,3,2],
  [60,"Ruang Tumbuh","Minimalis",7,15,2,3,2],[60,"Senja Bata","Industrial",8,14,2,3,2],
  [70,"Taman Dalam","Japandi",8,15,2,3,3],[72,"Karsa Tropika","Tropis",8,16,2,4,3],
  [75,"Batu Layar","Kontemporer",9,15,2,4,3],[80,"Teduh Selatan","Tropis",9,16,2,4,3],
  [85,"Aruna Void","Modern",9,17,2,4,3],[90,"Paviliun Hijau","Nusantara",10,16,2,4,3],
  [96,"Langit Tengah","Modern",10,18,2,4,4],[100,"Sela Terakota","Industrial",10,20,2,4,4],
  [105,"Kebun Atap","Tropis",11,19,2,4,4],[110,"Rumah Rona","Kontemporer",11,20,2,5,4],
  [115,"Serambi Dua","Nusantara",12,20,2,5,4],[120,"Wana Residence","Tropis",12,22,2,5,4],
] as const;

export const designs: Design[] = designSpecs.map((s, index) => ({
  id: `HB-${String(index + 1).padStart(3,"0")}`, type: s[0], name: s[1], style: s[2],
  width: s[3], length: s[4], floors: s[5], bedrooms: s[6], bathrooms: s[7],
  price: 1_350_000 + s[0] * 28_000, baseRab: s[0] * 5_900_000,
  image: `https://images.unsplash.com/${houseImages[index % houseImages.length]}?auto=format&fit=crop&w=1200&q=82`,
  facadeVariants: ["Kapur Hangat", "Hijau Rindang", "Bata Senja"],
  layoutVariants: ["Ruang Terbuka", "Kamar Fleksibel"],
}));

export const cities = [
  { name: "Jakarta Selatan", ikk: 1.14 }, { name: "Bandung", ikk: 1.03 },
  { name: "Bekasi", ikk: 1.06 }, { name: "Bogor", ikk: 1.02 },
  { name: "Yogyakarta", ikk: .94 }, { name: "Surabaya", ikk: 1.08 },
  { name: "Semarang", ikk: .99 }, { name: "Denpasar", ikk: 1.12 },
  { name: "Makassar", ikk: 1.09 }, { name: "Medan", ikk: 1.05 },
];

const productImage = "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80";
const appImages = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80",
];
const categories: MaterialCategory[] = ["Semen & Beton","Atap","Keramik & Saniter","Cat","Pipa & Elektrikal"];
const brands = [["SIG","Dynamix"],["Onduline","Tatalogam"],["Roman","TOTO"],["Dulux","Mowilex"],["Wavin","Schneider"]];

export const materials: MaterialProduct[] = categories.flatMap((category, ci) =>
  brands[ci].map((brand, bi) => ({
    id: `MAT-${ci + 1}-${bi + 1}`, category, brand, name: `${brand} ${bi ? "Pro" : "Essential"}`,
    unit: ci === 0 ? "zak" : ci === 3 ? "pail" : "paket", unitPrice: [72_000,185_000,325_000,910_000,640_000][ci] * (bi + 1),
    discount: bi ? 7 : 5, cities: bi ? ["Jakarta Selatan","Bandung","Surabaya","Denpasar"] : cities.map(c => c.name),
    packageImage: productImage, applicationImage: appImages[ci],
    applicationKind: ci === 0 || ci === 4 ? "diagram" : "render",
  }))
);

export const contractors = [
  { id:"K-01", name:"Ruang Rakit Konstruksi", city:"Bandung", specialty:"Rumah tropis", rating:4.8 },
  { id:"K-02", name:"Bangun Rapi Nusantara", city:"Jakarta Selatan", specialty:"Rumah 2 lantai", rating:4.7 },
  { id:"K-03", name:"Teras Karya", city:"Surabaya", specialty:"Japandi & minimalis", rating:4.9 },
  { id:"K-04", name:"Saka Lokal", city:"Yogyakarta", specialty:"Material lokal", rating:4.6 },
];

export const flowSteps = ["Masuk","Isi Lahan","Pilih Type","Pilih Varian","Pilih Material","Kontraktor","Ringkasan","Akun & OTP","Checkout","Paket Terbit"];

export const formatRupiah = (value: number) => new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR", maximumFractionDigits:0 }).format(value);
export const getIkk = (city: string) => cities.find(c => c.name === city)?.ikk ?? 1;
export const fitReason = (design: Design, width: number, length: number) => {
  const reasons: string[] = [];
  if (width < design.width) reasons.push(`Lebar lahan kurang ${design.width - width}m`);
  if (length < design.length) reasons.push(`Panjang lahan kurang ${design.length - length}m`);
  return reasons.join(" · ");
};
