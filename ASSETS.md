# Assets

Aset permainan level 2–5 berada di `client/public/assets` dan tersedia saat runtime melalui URL `/assets/<nama>.png`.

## Aturan level

- **Level 1** sengaja tidak diubah: benda dan tempat tujuan tetap menggunakan emoji seperti sebelumnya.
- **Level 2–5** menggunakan PNG lokal untuk benda dan tempat tujuan. Contoh: `client/public/assets/panci.png` untuk benda di dapur dan `client/public/assets/dapur.png` untuk tempatnya.
- Nama file menggunakan huruf kecil dengan tanda hubung, misalnya `tempat-tidur.png`, `papan-tulis.png`, dan `ruang-tamu.png`.

## Aset tampilan umum

Cover, kartu subtema, maskot, dan ilustrasi perayaan masih menggunakan aset `/manus-storage/...` yang sudah disediakan oleh proyek. Perubahan ini hanya memindahkan aset gameplay level 2–5 ke folder lokal agar tidak bergantung pada storage eksternal.
