export type ThemeId = "home" | "school" | "around" | "public" | "clean";

export type GameObject = {
  id: string;
  label: string;
  emoji: string;
  image?: string;
  targetId: string;
  hint: string;
};

export type DropZone = {
  id: string;
  label: string;
  emoji: string;
  image?: string;
  color: string;
  shape: "room" | "shelf" | "yard" | "circle" | "bin";
};

export type Level = {
  level: number;
  title: string;
  intro: string;
  objects: GameObject[];
  zones: DropZone[];
};

export type Theme = {
  id: ThemeId;
  title: string;
  shortTitle: string;
  icon: string;
  image?: string;
  color: string;
  lightColor: string;
  description: string;
  levels: Level[];
};

type Pair = [string, string, string, string];

const generatedImages = {
  chair: "/manus-storage/paud-kursi_fe5a9cec.png",
  bed: "/manus-storage/paud-tempat-tidur_8f047d48.png",
  stove: "/manus-storage/paud-kompor_796b6904.png",
  book: "/manus-storage/paud-buku_04eb3e52.png",
  trash: "/manus-storage/paud-tempat-sampah_1df7eac3.png",
  livingRoom: "/manus-storage/paud-ruang-tamu_9d7e3336.png",
  bedroom: "/manus-storage/paud-kamar_32e2a3c6.png",
  kitchen: "/manus-storage/paud-dapur_35bf5c59.png",
  bookshelf: "/manus-storage/paud-rak-buku_abf2b074.png",
  recycling: "/manus-storage/paud-bank-sampah_275e2b85.png",
  homeTheme: "/manus-storage/subtema-rumahku_bde87ca8.png",
  schoolTheme: "/manus-storage/subtema-sekolahku_2bfe3581.png",
  aroundTheme: "/manus-storage/subtema-sekitar-rumah_ae6ed485.png",
  publicTheme: "/manus-storage/subtema-tempat-umum_9704c5ea.png",
  cleanTheme: "/manus-storage/subtema-kebersihan_26ca62f7.png",
};

const assetSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Level 1 intentionally keeps the original generated images. Levels 2–5 use
// local files from client/public/assets so gameplay does not depend on storage URLs.
const imageForObject = (label: string, level: number) => {
  if (level === 1) {
    if (["Kursi", "Tempat duduk", "Bangku"].includes(label)) return generatedImages.chair;
    if (label === "Tempat tidur") return generatedImages.bed;
    if (label === "Kompor") return generatedImages.stove;
    if (["Buku", "Peta"].includes(label)) return generatedImages.book;
    if (["Botol plastik", "Sisa makanan", "Kertas", "Kaleng", "Daun", "Gelas plastik", "Kardus", "Kantong kresek"].includes(label)) return generatedImages.trash;
    return undefined;
  }
  // The kitchen item is intentionally named panci.png in the local assets.
  return `/assets/${label === "Kompor" ? "panci" : assetSlug(label)}.png`;
};
const imageForZone = (zoneId: string, level: number) => {
  if (level === 1) {
    if (["ruang-tamu", "keluarga"].includes(zoneId)) return generatedImages.livingRoom;
    if (zoneId === "kamar") return generatedImages.bedroom;
    if (zoneId === "dapur") return generatedImages.kitchen;
    if (["rak-buku", "perpustakaan", "kelas"].includes(zoneId)) return generatedImages.bookshelf;
    if (["plastik", "organik", "kertas", "anorganik"].includes(zoneId)) return generatedImages.recycling;
    return undefined;
  }
  return `/assets/${assetSlug(zoneId)}.png`;
};

const themeBlueprints: Record<ThemeId, { title: string; shortTitle: string; icon: string; color: string; lightColor: string; description: string; pairs: Pair[]; intros: string[] }> = {
  home: {
    title: "Rumahku",
    shortTitle: "RUMAHKU",
    icon: "🏠",
    color: "#F26B5E",
    lightColor: "#FFF0E8",
    description: "Ayo kenali ruangan dan benda-benda di rumah.",
    pairs: [
      ["Kursi", "🪑", "ruang-tamu", "Ruang Tamu"],
      ["Tempat tidur", "🛏️", "kamar", "Kamar Tidur"],
      ["Kompor", "🍳", "dapur", "Dapur"],
      ["Televisi", "📺", "keluarga", "Ruang Keluarga"],
      ["Sikat gigi", "🪥", "mandi", "Kamar Mandi"],
      ["Lemari", "🚪", "kamar", "Kamar Tidur"],
      ["Piring", "🍽️", "dapur", "Dapur"],
      ["Lampu meja", "💡", "ruang-tamu", "Ruang Tamu"],
    ],
    intros: ["Cari tempat yang cocok untuk benda di rumah!", "Rumah jadi rapi kalau setiap benda punya tempat.", "Ayo kenali ruangan di rumah.", "Perhatikan bentuk ruangannya, lalu seret bendanya.", "Tantangan rumah terakhir — kamu pasti bisa!"]
  },
  school: {
    title: "Sekolahku",
    shortTitle: "SEKOLAHKU",
    icon: "🏫",
    color: "#267CCB",
    lightColor: "#E8F4FF",
    description: "Temukan tempat yang tepat untuk benda-benda di sekolah.",
    pairs: [
      ["Buku", "📚", "rak-buku", "Rak Buku"],
      ["Pensil", "✏️", "alat-tulis", "Tempat Alat Tulis"],
      ["Papan tulis", "🧑‍🏫", "kelas", "Ruang Kelas"],
      ["Bola", "⚽", "olahraga", "Area Olahraga"],
      ["Tas sekolah", "🎒", "tas", "Tempat Tas"],
      ["Krayon", "🖍️", "alat-tulis", "Tempat Alat Tulis"],
      ["Ayunan", "🎠", "taman", "Halaman Sekolah"],
      ["Kotak makan", "🍱", "tas", "Tempat Tas"],
    ],
    intros: ["Ayo bantu benda sekolah menemukan tempatnya!", "Sekolah rapi, belajar jadi senang.", "Kenali tempat-tempat di sekolah.", "Pilih rak, kelas, atau halaman yang tepat.", "Tantangan sekolah terakhir — semangat!"]
  },
  around: {
    title: "Lingkungan Sekitar Rumah",
    shortTitle: "SEKITAR RUMAH",
    icon: "🌳",
    color: "#2E9B63",
    lightColor: "#E8F8EF",
    description: "Kenali benda dan tempat yang ada di sekitar rumah.",
    pairs: [
      ["Pohon", "🌳", "taman", "Taman"],
      ["Sepeda", "🚲", "halaman", "Halaman"],
      ["Mobil", "🚗", "garasi", "Garasi"],
      ["Tanaman", "🪴", "kebun", "Kebun"],
      ["Lampu jalan", "💡", "jalan", "Jalan"],
      ["Ayunan", "🛝", "taman", "Taman"],
      ["Bola", "⚽", "halaman", "Halaman"],
      ["Kunci mobil", "🔑", "garasi", "Garasi"],
    ],
    intros: ["Yuk jelajahi lingkungan dekat rumah!", "Lingkungan hijau terasa nyaman.", "Cari tempat yang sesuai di sekitar rumah.", "Lihat bentuk area tujuan dengan teliti.", "Tantangan lingkungan terakhir — hebat!"]
  },
  public: {
    title: "Tempat Umum",
    shortTitle: "TEMPAT UMUM",
    icon: "🏞️",
    color: "#8B61C9",
    lightColor: "#F3ECFF",
    description: "Belajar mengenal tempat umum yang sering kita kunjungi.",
    pairs: [
      ["Tempat duduk", "🪑", "taman", "Taman Kota"],
      ["Bus", "🚌", "halte", "Halte"],
      ["Buku", "📖", "perpustakaan", "Perpustakaan"],
      ["Obat", "💊", "apotek", "Apotek"],
      ["Mobil pemadam", "🚒", "pemadam", "Pemadam Kebakaran"],
      ["Peta", "🗺️", "perpustakaan", "Perpustakaan"],
      ["Bangku", "🪑", "halte", "Halte"],
      ["Payung", "☂️", "taman", "Taman Kota"],
    ],
    intros: ["Ayo kenali tempat-tempat umum di kota!", "Tempat umum digunakan bersama-sama.", "Benda ini biasanya ada di mana?", "Cari fasilitas umum yang cocok.", "Tantangan tempat umum terakhir!"]
  },
  clean: {
    title: "Kebersihan Lingkungan",
    shortTitle: "KEBERSIHAN",
    icon: "🗑️",
    color: "#E0A62D",
    lightColor: "#FFF7DA",
    description: "Ayo memilah sampah dan menjaga lingkungan tetap bersih.",
    pairs: [
      ["Botol plastik", "🧴", "plastik", "Sampah Plastik"],
      ["Sisa makanan", "🍎", "organik", "Sampah Organik"],
      ["Kertas", "📄", "kertas", "Sampah Kertas"],
      ["Kaleng", "🥫", "anorganik", "Sampah Anorganik"],
      ["Daun", "🍂", "organik", "Sampah Organik"],
      ["Gelas plastik", "🥤", "plastik", "Sampah Plastik"],
      ["Kardus", "📦", "kertas", "Sampah Kertas"],
      ["Kantong kresek", "🛍️", "anorganik", "Sampah Anorganik"],
    ],
    intros: ["Yuk pilah sampah agar lingkungan bersih!", "Setiap sampah punya tempatnya.", "Cari tempat sampah yang tepat.", "Perhatikan bahan bendanya ya.", "Tantangan kebersihan terakhir — kamu penjaga bumi!"]
  },
};

const zoneShapes: DropZone["shape"][] = ["room", "shelf", "yard", "circle", "bin"];

export const themes: Theme[] = (Object.keys(themeBlueprints) as ThemeId[]).map((id) => {
  const blueprint = themeBlueprints[id];
  const levels = Array.from({ length: 5 }, (_, index) => {
    const count = Math.min(3 + index, 7);
    const selectedPairs = blueprint.pairs.slice(0, count);
    const uniqueZones = Array.from(new Map(selectedPairs.map((pair) => [pair[2], pair])).values());
    return {
      level: index + 1,
      title: `Level ${index + 1}`,
      intro: blueprint.intros[index],
      objects: selectedPairs.map(([label, emoji, targetId, targetLabel], itemIndex) => ({
        id: `${id}-${index + 1}-${itemIndex}`,
        label,
        emoji,
        image: imageForObject(label, index + 1),
        targetId,
        hint: `Letakkan di ${targetLabel}`,
      })),
      zones: uniqueZones.map((pair, zoneIndex) => ({
        id: pair[2],
        label: pair[3],
        emoji: zoneIndex % 2 === 0 ? "📍" : "✨",
        image: imageForZone(pair[2], index + 1),
        color: blueprint.color,
        shape: zoneShapes[(index + zoneIndex) % zoneShapes.length],
      })),
    };
  });

  const themeImage = { home: generatedImages.homeTheme, school: generatedImages.schoolTheme, around: generatedImages.aroundTheme, public: generatedImages.publicTheme, clean: generatedImages.cleanTheme }[id];
  return { id, title: blueprint.title, shortTitle: blueprint.shortTitle, icon: blueprint.icon, image: themeImage, color: blueprint.color, lightColor: blueprint.lightColor, description: blueprint.description, levels };
});

export const getTheme = (id: ThemeId) => themes.find((theme) => theme.id === id) ?? themes[0];
export const getLevel = (themeId: ThemeId, levelNumber: number) => getTheme(themeId).levels[levelNumber - 1] ?? getTheme(themeId).levels[0];
export const allThemeIds = themes.map((theme) => theme.id);
