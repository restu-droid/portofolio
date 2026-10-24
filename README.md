# Portofolio — Restu Rosenda

Website portofolio pribadi satu halaman yang dibuat dengan **HTML, CSS, dan JavaScript murni** (tanpa framework). Tema gelap dengan aksen *teal/jade* yang tenang, dilengkapi tema terang, animasi halus, dan tata letak responsif.

## Struktur file

```
.
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── img/
│       ├── restu-profil-perlengkapan.jpg      (foto profil)
│       ├── rakit-pc.jpg                        (perakitan & troubleshooting PC)
│       ├── setting-modem-wifi-isp-pandawa.jpg  (setting modem + Wi-Fi ISP)
│       ├── konfigurasi-router.jpg              (konfigurasi router)
│       ├── cek-redaman-ftth.jpg                (pengecekan redaman FTTH / OPM)
│       ├── konfigurasi-debian-server.jpg       (konfigurasi server Linux)
│       ├── kegiatan-pkl.jpg                    (pengalaman PKL)
│       └── pkl-splicing-fiber.jpg              (tes splicing fiber optic)
└── README.md
```

## Cara menjalankan

Cukup buka `index.html` di browser (double-click). Agar font Google Fonts dan semua fitur berjalan optimal, kamu juga bisa memakai ekstensi **Live Server** di VS Code.

## Fitur

- Desain responsif (desktop, tablet, dan ponsel)
- Tema gelap dan terang, tersimpan otomatis di browser
- Animasi reveal saat menggulir, efek mengetik, dan progress bar keahlian
- Navigasi dengan penanda bagian aktif, menu mobile, dan tombol kembali ke atas
- Galeri "Perjalanan" berisi 7 dokumentasi kegiatan
- Form kontak yang membuka aplikasi email (mailto)
- Menghormati pengaturan `prefers-reduced-motion` untuk aksesibilitas

## Mengganti foto

Semua foto berada di `assets/img/`. Untuk mengganti, cukup timpa file dengan nama yang sama (rasio portrait 3:4 atau 4:5 paling pas), atau ubah atribut `src` pada `index.html`:

- Foto profil: elemen `<img class="portrait-photo">` di bagian Hero
- Foto kegiatan: elemen `<img>` di dalam `.journey-gallery`

## Kontak

Data kontak yang terpasang saat ini:

- **WhatsApp:** 0857-1714-9827 (`https://wa.me/6285717149827`)
- **Email:** ceotutu28@gmail.com
- **Instagram:** [@restuursndaa](https://instagram.com/restuursndaa)

Tempat mengubahnya:

- Bagian `#contact` pada `index.html` (daftar kontak)
- Footer pada `index.html` (tautan sosial)
- Atribut `data-email` pada `<form id="contactForm">` — dipakai untuk tujuan form kontak
- `assets/js/main.js` pada baris `const email = form.dataset.email || "..."` (cadangan bila `data-email` kosong)

## Yang perlu kamu ganti

1. **Persentase keahlian** — sesuaikan angka dan teksnya di bagian `#skills`.
2. **Daftar alat/teknologi** — sesuaikan chip di bagian keahlian dengan yang benar-benar sudah dipelajari.
3. **Teks perjalanan dan tujuan** — sesuaikan bila ada detail yang ingin ditambahkan.

## Warna

Aksen utama diatur lewat variabel CSS di `assets/css/style.css`:

- Tema gelap: `--accent: #74c7b0`
- Tema terang: `--accent: #1f7f70`

Ubah empat variabel `--accent`, `--accent-strong`, `--accent-deep`, dan `--accent-soft` untuk mengganti seluruh warna aksen situs.

## Publikasi

Website ini statis, jadi bisa langsung diunggah ke:

- **GitHub Pages** — unggah semua file ke repositori, lalu aktifkan Pages dari branch `main`.
- **Netlify / Vercel** — drag-and-drop folder proyek, atau hubungkan ke repositori GitHub.

## Jika situs tampil "polos" (tanpa gaya)

Hampir selalu ini masalah cache, bukan file yang hilang. Cek berurutan:

1. Buka `https://domain-kamu/assets/css/style.css` langsung di browser. Kalau muncul kode CSS (diawali `/* ... */` dengan `--accent`), berarti file sudah benar di server.
2. Muat ulang paksa halaman: **Ctrl + Shift + R** (Windows) atau **Cmd + Shift + R** (Mac).
3. Coba **jendela Incognito** (Ctrl + Shift + N) — kalau di Incognito tampil normal, berarti cache browser biasa yang bermasalah.
4. Tunggu 1–2 menit setelah upload (GitHub Pages butuh waktu build), lalu cek tab **Actions** di repo.
5. Kalau masih polos: buka **F12 → Console** dan **F12 → Network**, cari baris merah atau file `style.css` berstatus 404.

Setiap kali mengubah `style.css` atau `main.js`, naikkan angka versi di `index.html` agar browser tidak memakai file lama:

```html
<link rel="stylesheet" href="assets/css/style.css?v=2" />
<script src="assets/js/main.js?v=2"></script>
```


## Catatan

Form kontak tidak memakai server/back end. Saat dikirim, browser akan membuka aplikasi email pengunjung dengan isi pesan yang sudah terisi. Jika ingin pesan masuk langsung tanpa aplikasi email, form bisa dihubungkan ke layanan seperti Formspree.
