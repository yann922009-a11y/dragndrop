# Lingkunganku — Asset Guide

Semua aset permainan yang dipakai oleh frontend sekarang dibundel secara lokal:

- `client/public/assets/objects/` — satu SVG unik untuk setiap benda permainan, plus WebP objek dapur level 2.
- `client/public/assets/themes/` — ilustrasi lima kartu subtema.
- `client/public/assets/level-scenes/` — ilustrasi scene level yang tersedia.
- `client/public/assets/ui/` — hero, maskot, dan ilustrasi perayaan.

## Mengganti gambar dengan gambar sendiri

1. Masukkan file baru ke folder `client/public/assets/objects/`.
2. Gunakan nama file slug benda, misalnya `piring.svg`, `bantal.svg`, atau `bus-sekolah.svg`.
3. Untuk mengganti gambar dapur level 2, pertahankan nama `fix-level-2-piring.webp`, `fix-level-2-sendok.webp`, `fix-level-2-gelas.webp`, dan `fix-level-2-panci.webp`, atau ubah mapping di `client/src/game/data.ts`.
4. Jalankan `pnpm check` dan `pnpm build`.

Semua gambar drop otomatis menggunakan gambar benda yang sama lalu diberi filter grayscale, sehingga pasangan drag → drop selalu cocok.
