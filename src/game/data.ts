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
  difficulty: string;
  intro: string;
  art?: string;
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

type ItemDef = [label: string, emoji: string, targetId: string, targetLabel: string];
type ZoneDef = [id: string, label: string, emoji: string];

/** Inline SVG data URIs keep every object and target local, crisp, and instant to load. */
const svgIcon = (emoji: string, color: string, shape: "object" | "zone") => {
  const safeEmoji = emoji.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const backdrop = shape === "zone" ? `<rect x="8" y="8" width="144" height="144" rx="32" fill="${color}" opacity=".18"/><path d="M28 104h104M38 104V62l42-30 42 30v42" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>` : `<circle cx="80" cy="80" r="58" fill="${color}" opacity=".16"/><circle cx="80" cy="80" r="44" fill="#fff" opacity=".85"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><defs><filter id="s"><feDropShadow dx="0" dy="5" stdDeviation="3" flood-opacity=".16"/></filter></defs>${backdrop}<text x="80" y="96" text-anchor="middle" font-size="66" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif" filter="url(#s)">${safeEmoji}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const palette = { home: "#f26b5e", school: "#267ccb", around: "#2e9b63", public: "#8b61c9", clean: "#e0a62d" } as const;

const localObjectImages: Record<string, string> = {
  Piring: "/assets/objects/fix-level-2-piring.webp",
  Sendok: "/assets/objects/fix-level-2-sendok.webp",
  Gelas: "/assets/objects/fix-level-2-gelas.webp",
  Panci: "/assets/objects/fix-level-2-panci.webp",
};

const publicPlaceImages: Record<string, string> = {
  "Rumah sakit": svgIcon("🏥", "#e5484d", "object"),
  "Terminal bus": svgIcon("🚌", "#f59f00", "object"),
  "Stasiun kereta api": svgIcon("🚆", "#267ccb", "object"),
  "Pasar": svgIcon("🛒", "#2e9b63", "object"),
  "Perpustakaan": svgIcon("📚", "#8b61c9", "object"),
  "Kantor pos": svgIcon("📮", "#f26b5e", "object"),
  "Taman": svgIcon("🌳", "#3aa655", "object"),
  "Bank": svgIcon("🏦", "#4c6ef5", "object"),
};

const objectSlug = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const localObjectImage = (label: string) => localObjectImages[label] ?? publicPlaceImages[label] ?? `/assets/objects/${objectSlug(label)}.svg`;

const generatedLevelArt: Record<string, string> = {
  "home-1": "/assets/level-scenes/level-1-bed.webp",
  "home-2": "/assets/level-scenes/level-2-home.webp",
  "home-3": "/assets/level-scenes/level-3-home.webp",
  "home-4": "/assets/level-scenes/level-4-home.webp",
  "home-5": "/assets/level-scenes/level-5-home.webp",

  "school-1": "/assets/level-scenes/level-1-school.webp",
  "school-2": "/assets/level-scenes/level-2-school.webp",
  "school-3": "/assets/level-scenes/level-3-school.webp",
  "school-4": "/assets/level-scenes/level-4-school.webp",
  "school-5": "/assets/level-scenes/level-5-myschool.webp",

  "around-1": "/assets/level-scenes/level-1-around.webp",
  "around-2": "/assets/level-scenes/level-2-around.webp",
  "around-3": "/assets/level-scenes/level-3-around.webp",
  "around-4": "/assets/level-scenes/level-4-around.webp",
  "around-5": "/assets/level-scenes/level-5-aroundhome.webp",

  "public-1": "/assets/level-scenes/level-1-public.webp",
  "public-2": "/assets/level-scenes/level-2-public.webp",
  "public-3": "/assets/level-scenes/level-3-public.webp",
  "public-4": "/assets/level-scenes/level-4-public.webp",
  "public-5": "/assets/level-scenes/level-5-publicplace.webp",

  "clean-1": "/assets/level-scenes/level-1-cleaning.webp",
  "clean-2": "/assets/level-scenes/level-2-cleaning.webp",
  "clean-3": "/assets/level-scenes/level-3-cleaning.webp",
  "clean-4": "/assets/level-scenes/level-4-cleaning.webp",
  "clean-5": "/assets/level-scenes/level-5-cleaning.webp",
};

const levelFallbackArt = (theme: ThemeId, level: number) => {
  const color = palette[theme];
  const accents = ["#36b9ee", "#ffd34d", "#ff6f91", "#75d66f", "#8d72e8"];
  const accent = accents[(level - 1) % accents.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540"><rect width="960" height="540" rx="44" fill="#eefaff"/><circle cx="110" cy="96" r="82" fill="${accent}" opacity=".5"/><circle cx="850" cy="100" r="120" fill="${color}" opacity=".25"/><path d="M0 405 Q220 300 470 410T960 380V540H0Z" fill="${color}" opacity=".3"/><path d="M110 360h740v80H110z" fill="#fff" opacity=".75"/><path d="M175 355V210h210v145M470 355V160h200v195M735 355V235h110v120" fill="none" stroke="${color}" stroke-width="18" stroke-linejoin="round"/><circle cx="250" cy="140" r="26" fill="${accent}"/><circle cx="520" cy="106" r="22" fill="${accent}"/><circle cx="790" cy="190" r="30" fill="${accent}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const makeLevel = (theme: ThemeId, level: number, title: string, intro: string, items: ItemDef[], _zones: ZoneDef[]): Level => {
  const objects = items.map(([label, emoji, targetId, targetLabel], index) => ({
    id: `${theme}-${level}-${index}-${targetId}`,
    label,
    emoji,
    image: localObjectImage(label),
    targetId,
    hint: `Letakkan di ${targetLabel}`,
  }));
  return {
    level,
    title,
    difficulty: ["Sangat mudah", "Mudah", "Sedang", "Sulit", "Sangat menantang"][level - 1],
    intro,
    art: generatedLevelArt[`${theme}-${level}`] ?? levelFallbackArt(theme, level),
    objects,
    // One exact visual pair per object: colorful drag image → matching gray sketch.
    zones: objects.map((object, index) => ({
      id: object.id,
      label: object.label,
      emoji: object.emoji,
      image: object.image,
      color: palette[theme],
      shape: (["room", "shelf", "yard", "circle", "bin"] as DropZone["shape"][])[(level + index) % 5],
    })),
  };
};

const themeBlueprints: Record<ThemeId, Omit<Theme, "id" | "levels"> & { levels: Level[] }> = {
  home: {
    title: "Rumahku", shortTitle: "RUMAHKU", icon: "🏠", color: palette.home, lightColor: "#fff0e8",
    image: "/assets/themes/subtema-rumahku.webp",
    description: "Kenali kamar, dapur, dan ruangan di rumah.",
    levels: [
      makeLevel("home", 1, "Mengenal benda di kamar tidur", "Cari benda-benda yang ada di kamar tidur.", [
        ["Bantal", "🛏️", "tempat-tidur", "Tempat Tidur"], ["Guling", "🛌", "tempat-tidur", "Tempat Tidur"], ["Selimut", "🧣", "tempat-tidur", "Tempat Tidur"],
      ], [["tempat-tidur", "Tempat Tidur", "🛏️"]]),
      makeLevel("home", 2, "Mengenal benda di dapur", "Seret peralatan dapur ke area dapur.", [
        ["Piring", "🍽️", "dapur", "Dapur"], ["Sendok", "🥄", "dapur", "Dapur"], ["Gelas", "🥛", "dapur", "Dapur"], ["Panci", "🍲", "dapur", "Dapur"],
      ], [["dapur", "Dapur", "🍳"]]),
      makeLevel("home", 3, "Mencocokkan benda dengan ruangan", "Pilih ruangan yang tepat untuk setiap benda.", [
        ["Kursi", "🪑", "ruang-tamu", "Ruang Tamu"], ["Tempat tidur", "🛏️", "kamar", "Kamar Tidur"], ["Sikat gigi", "🪥", "kamar-mandi", "Kamar Mandi"], ["Televisi", "📺", "ruang-tamu", "Ruang Tamu"], ["Sabun", "🧼", "kamar-mandi", "Kamar Mandi"], ["Lampu meja", "💡", "kamar", "Kamar Tidur"],
      ], [["ruang-tamu", "Ruang Tamu", "🛋️"], ["kamar", "Kamar Tidur", "🛏️"], ["kamar-mandi", "Kamar Mandi", "🛁"]]),
      makeLevel("home", 4, "Melengkapi isi rumah", "Lengkapi empat ruangan dengan benda yang sesuai.", [
        ["Kursi", "🪑", "ruang-tamu", "Ruang Tamu"], ["Lampu", "💡", "ruang-tamu", "Ruang Tamu"], ["Bantal", "🛏️", "kamar", "Kamar Tidur"], ["Lemari", "🚪", "kamar", "Kamar Tidur"], ["Panci", "🍲", "dapur", "Dapur"], ["Piring", "🍽️", "dapur", "Dapur"], ["Sikat gigi", "🪥", "kamar-mandi", "Kamar Mandi"], ["Sabun", "🧼", "kamar-mandi", "Kamar Mandi"],
      ], [["ruang-tamu", "Ruang Tamu", "🛋️"], ["kamar", "Kamar Tidur", "🛏️"], ["dapur", "Dapur", "🍳"], ["kamar-mandi", "Kamar Mandi", "🛁"]]),
      makeLevel("home", 5, "Menata rumahku", "Tantangan terakhir: tempatkan semua perabot dengan mandiri.", [
        ["Sofa", "🛋️", "ruang-tamu", "Ruang Tamu"], ["Televisi", "📺", "ruang-tamu", "Ruang Tamu"], ["Bantal", "🛏️", "kamar", "Kamar Tidur"], ["Lemari", "🚪", "kamar", "Kamar Tidur"], ["Panci", "🍲", "dapur", "Dapur"], ["Sendok", "🥄", "dapur", "Dapur"], ["Sabun", "🧼", "kamar-mandi", "Kamar Mandi"], ["Handuk", "🧺", "kamar-mandi", "Kamar Mandi"], ["Lampu", "💡", "kamar", "Kamar Tidur"], ["Kursi", "🪑", "ruang-tamu", "Ruang Tamu"],
      ], [["ruang-tamu", "Ruang Tamu", "🛋️"], ["kamar", "Kamar Tidur", "🛏️"], ["dapur", "Dapur", "🍳"], ["kamar-mandi", "Kamar Mandi", "🛁"]]),
    ],
  },
  school: {
    title: "Sekolahku", shortTitle: "SEKOLAHKU", icon: "🏫", color: palette.school, lightColor: "#e8f4ff",
    image: "/assets/themes/subtema-sekolahku.webp", description: "Jelajahi kelas, halaman, dan tempat belajar.",
    levels: [
      makeLevel("school", 1, "Benda di ruang kelas", "Ayo masukkan benda kelas ke ruang kelas.", [["Buku", "📚", "kelas", "Ruang Kelas"], ["Pensil", "✏️", "kelas", "Ruang Kelas"], ["Tas", "🎒", "kelas", "Ruang Kelas"]], [["kelas", "Ruang Kelas", "🏫"]]),
      makeLevel("school", 2, "Benda di halaman sekolah", "Cari tempat yang cocok di halaman sekolah.", [["Bola", "⚽", "halaman", "Halaman Sekolah"], ["Ayunan", "🎠", "halaman", "Halaman Sekolah"], ["Perosotan", "🛝", "halaman", "Halaman Sekolah"], ["Tanaman", "🌱", "halaman", "Halaman Sekolah"]], [["halaman", "Halaman Sekolah", "🌳"]]),
      makeLevel("school", 3, "Mengenal ruangan sekolah", "Cocokkan benda dengan ruangan sekolah.", [["Buku", "📚", "perpustakaan", "Perpustakaan"], ["Rak buku", "📖", "perpustakaan", "Perpustakaan"], ["Pensil", "✏️", "kelas", "Ruang Kelas"], ["Papan tulis", "🧑‍🏫", "kelas", "Ruang Kelas"], ["Bola", "⚽", "halaman", "Halaman Sekolah"], ["Ayunan", "🎠", "halaman", "Halaman Sekolah"]], [["kelas", "Ruang Kelas", "🏫"], ["perpustakaan", "Perpustakaan", "📚"], ["halaman", "Halaman Sekolah", "🌳"]]),
      makeLevel("school", 4, "Menempatkan benda di sekolah", "Tempatkan benda ke empat area sekolah.", [["Buku", "📚", "perpustakaan", "Perpustakaan"], ["Rak buku", "📖", "perpustakaan", "Perpustakaan"], ["Pensil", "✏️", "kelas", "Ruang Kelas"], ["Papan tulis", "🧑‍🏫", "kelas", "Ruang Kelas"], ["Bola", "⚽", "halaman", "Halaman Sekolah"], ["Ayunan", "🎠", "halaman", "Halaman Sekolah"], ["Tas", "🎒", "loker", "Loker Tas"], ["Kotak makan", "🍱", "loker", "Loker Tas"]], [["kelas", "Ruang Kelas", "🏫"], ["perpustakaan", "Perpustakaan", "📚"], ["halaman", "Halaman Sekolah", "🌳"], ["loker", "Loker Tas", "🎒"]]),
      makeLevel("school", 5, "Jelajah sekolahku", "Jelajahi lima area sekolah tanpa petunjuk langsung.", [["Buku", "📚", "perpustakaan", "Perpustakaan"], ["Kamus", "📖", "perpustakaan", "Perpustakaan"], ["Pensil", "✏️", "kelas", "Ruang Kelas"], ["Papan tulis", "🧑‍🏫", "kelas", "Ruang Kelas"], ["Bola", "⚽", "halaman", "Halaman Sekolah"], ["Perosotan", "🛝", "halaman", "Halaman Sekolah"], ["Tas", "🎒", "loker", "Loker Tas"], ["Kotak makan", "🍱", "loker", "Loker Tas"], ["Bus sekolah", "🚌", "gerbang", "Gerbang Sekolah"], ["Bendera", "🚩", "gerbang", "Gerbang Sekolah"]], [["kelas", "Ruang Kelas", "🏫"], ["perpustakaan", "Perpustakaan", "📚"], ["halaman", "Halaman Sekolah", "🌳"], ["loker", "Loker Tas", "🎒"], ["gerbang", "Gerbang Sekolah", "🚪"]]),
    ],
  },
  around: {
    title: "Lingkungan Sekitar Rumah", shortTitle: "SEKITAR RUMAH", icon: "🌳", color: palette.around, lightColor: "#e8f8ef",
    image: "/assets/themes/subtema-sekitar-rumah.webp", description: "Kenali halaman, jalan, taman, dan warung.",
    levels: [
      makeLevel("around", 1, "Benda di halaman rumah", "Hiasi halaman rumah dengan benda yang tepat.", [["Pohon", "🌳", "halaman", "Halaman Rumah"], ["Bunga", "🌸", "halaman", "Halaman Rumah"], ["Pot", "🪴", "halaman", "Halaman Rumah"]], [["halaman", "Halaman Rumah", "🏡"]]),
      makeLevel("around", 2, "Kendaraan di sekitar rumah", "Tempatkan kendaraan di jalan atau parkir.", [["Sepeda", "🚲", "parkir", "Tempat Parkir"], ["Motor", "🏍️", "parkir", "Tempat Parkir"], ["Mobil", "🚗", "parkir", "Tempat Parkir"], ["Becak", "🛺", "jalan", "Jalan"]], [["jalan", "Jalan", "🛣️"], ["parkir", "Tempat Parkir", "🅿️"]]),
      makeLevel("around", 3, "Mengenal lingkungan sekitar", "Cocokkan benda dengan halaman, jalan, atau taman.", [["Pohon", "🌳", "taman", "Taman Lingkungan"], ["Bunga", "🌸", "taman", "Taman Lingkungan"], ["Sepeda", "🚲", "jalan", "Jalan"], ["Lampu jalan", "💡", "jalan", "Jalan"], ["Bola", "⚽", "halaman", "Halaman Rumah"], ["Pot", "🪴", "halaman", "Halaman Rumah"]], [["halaman", "Halaman Rumah", "🏡"], ["jalan", "Jalan", "🛣️"], ["taman", "Taman Lingkungan", "🌳"]]),
      makeLevel("around", 4, "Melengkapi lingkungan rumah", "Lengkapi halaman, jalan, warung, dan taman.", [["Pohon", "🌳", "taman", "Taman Lingkungan"], ["Bunga", "🌸", "taman", "Taman Lingkungan"], ["Sepeda", "🚲", "jalan", "Jalan"], ["Motor", "🏍️", "jalan", "Jalan"], ["Buah", "🍎", "warung", "Warung"], ["Keranjang", "🧺", "warung", "Warung"], ["Bola", "⚽", "halaman", "Halaman Rumah"], ["Pot", "🪴", "halaman", "Halaman Rumah"]], [["halaman", "Halaman Rumah", "🏡"], ["jalan", "Jalan", "🛣️"], ["warung", "Warung", "🏪"], ["taman", "Taman Lingkungan", "🌳"]]),
      makeLevel("around", 5, "Menyusun lingkungan sekitarku", "Atur sepuluh objek di lingkungan sekitar rumah.", [["Pohon", "🌳", "taman", "Taman Lingkungan"], ["Bunga", "🌸", "taman", "Taman Lingkungan"], ["Sepeda", "🚲", "jalan", "Jalan"], ["Mobil", "🚗", "jalan", "Jalan"], ["Buah", "🍎", "warung", "Warung"], ["Keranjang", "🧺", "warung", "Warung"], ["Bola", "⚽", "halaman", "Halaman Rumah"], ["Pot", "🪴", "halaman", "Halaman Rumah"], ["Bangku", "🪑", "taman", "Taman Lingkungan"], ["Becak", "🛺", "jalan", "Jalan"]], [["halaman", "Halaman Rumah", "🏡"], ["jalan", "Jalan", "🛣️"], ["warung", "Warung", "🏪"], ["taman", "Taman Lingkungan", "🌳"]]),
    ],
  },
  public: {
    title: "Tempat Umum", shortTitle: "TEMPAT UMUM", icon: "🏞️", color: palette.public, lightColor: "#f3ecff",
    image: "/assets/themes/subtema-tempat-umum.webp", description: "Belajar mengenal pasar, taman, dan tempat umum.",
    levels: [
      makeLevel("public", 1, "Berbelanja di pasar", "Bantu benda belanja menemukan pasar.", [["Apel", "🍎", "pasar", "Pasar"], ["Sayur", "🥕", "pasar", "Pasar"], ["Keranjang", "🧺", "pasar", "Pasar"]], [["pasar", "Pasar", "🛒"]]),
      makeLevel("public", 2, "Bermain di taman", "Tempatkan permainan dan bangku di taman.", [["Ayunan", "🎠", "taman", "Taman Kota"], ["Perosotan", "🛝", "taman", "Taman Kota"], ["Jungkat-jungkit", "⚖️", "taman", "Taman Kota"], ["Bangku taman", "🪑", "taman", "Taman Kota"]], [["taman", "Taman Kota", "🌳"]]),
      makeLevel("public", 3, "Rumah sakit dan perpustakaan", "Pilih tempat yang tepat untuk enam objek.", [["Ambulans", "🚑", "rumah-sakit", "Rumah Sakit"], ["Stetoskop", "🩺", "rumah-sakit", "Rumah Sakit"], ["Buku", "📚", "perpustakaan", "Perpustakaan"], ["Rak buku", "📖", "perpustakaan", "Perpustakaan"], ["Obat", "💊", "rumah-sakit", "Rumah Sakit"], ["Kamus", "📘", "perpustakaan", "Perpustakaan"]], [["rumah-sakit", "Rumah Sakit", "🏥"], ["perpustakaan", "Perpustakaan", "📚"]]),
      makeLevel("public", 4, "Mengenal berbagai tempat umum", "Seret setiap tempat umum ke gambar bayangannya yang cocok.", [["Rumah sakit", "🏥", "rumah-sakit", "Rumah Sakit"], ["Terminal bus", "🚌", "terminal-bus", "Terminal Bus"], ["Stasiun kereta api", "🚆", "stasiun", "Stasiun Kereta Api"], ["Pasar", "🛒", "pasar", "Pasar"], ["Perpustakaan", "📚", "perpustakaan", "Perpustakaan"], ["Kantor pos", "📮", "kantor-pos", "Kantor Pos"], ["Taman", "🌳", "taman", "Taman"], ["Bank", "🏦", "bank", "Bank"]], [["rumah-sakit", "Rumah Sakit", "🏥"], ["terminal-bus", "Terminal Bus", "🚌"], ["stasiun", "Stasiun Kereta Api", "🚆"], ["pasar", "Pasar", "🛒"], ["perpustakaan", "Perpustakaan", "📚"], ["kantor-pos", "Kantor Pos", "📮"], ["taman", "Taman", "🌳"], ["bank", "Bank", "🏦"]]),
      makeLevel("public", 5, "Jelajah tempat umum", "Jelajahi lima tempat umum yang berbeda.", [["Apel", "🍎", "pasar", "Pasar"], ["Keranjang", "🧺", "pasar", "Pasar"], ["Karpet", "🕌", "masjid", "Masjid"], ["Buku doa", "📕", "masjid", "Masjid"], ["Bus", "🚌", "terminal", "Terminal"], ["Tiket", "🎫", "terminal", "Terminal"], ["Kereta", "🚆", "stasiun", "Stasiun"], ["Koper", "🧳", "stasiun", "Stasiun"], ["Buku", "📚", "perpustakaan", "Perpustakaan"], ["Rak buku", "📖", "perpustakaan", "Perpustakaan"]], [["pasar", "Pasar", "🛒"], ["masjid", "Masjid", "🕌"], ["terminal", "Terminal", "🚌"], ["stasiun", "Stasiun", "🚆"], ["perpustakaan", "Perpustakaan", "📚"]]),
    ],
  },
  clean: {
    title: "Kebersihan Lingkungan", shortTitle: "KEBERSIHAN", icon: "🗑️", color: palette.clean, lightColor: "#fff7da",
    image: "/assets/themes/subtema-kebersihan.webp", description: "Ayo memilah sampah dan menjaga lingkungan tetap bersih.",
    levels: [
      makeLevel("clean", 1, "Membuang sampah", "Masukkan sampah ke tempat sampah.", [["Botol plastik", "🧴", "anorganik", "Sampah Anorganik"], ["Daun", "🍂", "organik", "Sampah Organik"], ["Kertas", "📄", "kertas", "Sampah Kertas"]], [["organik", "Sampah Organik", "🍃"], ["anorganik", "Sampah Anorganik", "♻️"], ["kertas", "Sampah Kertas", "📄"]]),
      makeLevel("clean", 2, "Mengenal alat kebersihan", "Cocokkan alat kebersihan dengan kegiatannya.", [["Sapu", "🧹", "menyapu", "Menyapu Halaman"], ["Pel", "🧽", "mengepel", "Mengepel Lantai"], ["Kemoceng", "🪶", "membersihkan", "Membersihkan Meja"], ["Pengki", "🗑️", "menyapu", "Menyapu Halaman"]], [["menyapu", "Menyapu Halaman", "🧹"], ["mengepel", "Mengepel Lantai", "🧽"], ["membersihkan", "Membersihkan Meja", "✨"]]),
      makeLevel("clean", 3, "Memilah sampah", "Pilah sampah organik dan anorganik.", [["Kulit pisang", "🍌", "organik", "Sampah Organik"], ["Daun", "🍂", "organik", "Sampah Organik"], ["Botol plastik", "🧴", "anorganik", "Sampah Anorganik"], ["Kaleng", "🥫", "anorganik", "Sampah Anorganik"], ["Sisa makanan", "🍎", "organik", "Sampah Organik"], ["Gelas plastik", "🥤", "anorganik", "Sampah Anorganik"]], [["organik", "Sampah Organik", "🍃"], ["anorganik", "Sampah Anorganik", "♻️"]]),
      makeLevel("clean", 4, "Membersihkan lingkungan", "Pilih alat dan kegiatan yang sesuai.", [["Sapu", "🧹", "halaman", "Menyapu Halaman"], ["Pengki", "🗑️", "halaman", "Menyapu Halaman"], ["Pel", "🧽", "lantai", "Mengepel Lantai"], ["Ember", "🪣", "lantai", "Mengepel Lantai"], ["Kemoceng", "🪶", "meja", "Membersihkan Meja"], ["Kain lap", "🧻", "meja", "Membersihkan Meja"], ["Sabun", "🧼", "kamar-mandi", "Membersihkan Kamar Mandi"], ["Sikat", "🪥", "kamar-mandi", "Membersihkan Kamar Mandi"]], [["halaman", "Menyapu Halaman", "🧹"], ["lantai", "Mengepel Lantai", "🧽"], ["meja", "Membersihkan Meja", "✨"], ["kamar-mandi", "Membersihkan Kamar Mandi", "🛁"]]),
      makeLevel("clean", 5, "Ayo, jaga kebersihan!", "Jadilah penjaga lingkungan yang hebat.", [["Botol plastik", "🧴", "anorganik", "Sampah Anorganik"], ["Daun", "🍂", "organik", "Sampah Organik"], ["Sapu", "🧹", "halaman", "Menyapu Halaman"], ["Pengki", "🗑️", "halaman", "Menyapu Halaman"], ["Pel", "🧽", "lantai", "Mengepel Lantai"], ["Ember", "🪣", "lantai", "Mengepel Lantai"], ["Kemoceng", "🪶", "meja", "Membersihkan Meja"], ["Kain lap", "🧻", "meja", "Membersihkan Meja"], ["Kaleng", "🥫", "anorganik", "Sampah Anorganik"], ["Sisa makanan", "🍎", "organik", "Sampah Organik"]], [["organik", "Sampah Organik", "🍃"], ["anorganik", "Sampah Anorganik", "♻️"], ["halaman", "Menyapu Halaman", "🧹"], ["lantai", "Mengepel Lantai", "🧽"], ["meja", "Membersihkan Meja", "✨"]]),
    ],
  },
};

export const themes: Theme[] = (Object.keys(themeBlueprints) as ThemeId[]).map((id) => ({ id, ...themeBlueprints[id] }));
export const getTheme = (id: ThemeId) => themes.find((theme) => theme.id === id) ?? themes[0];
export const getLevel = (themeId: ThemeId, levelNumber: number) => getTheme(themeId).levels[levelNumber - 1] ?? getTheme(themeId).levels[0];
export const allThemeIds = themes.map((theme) => theme.id);
