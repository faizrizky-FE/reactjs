# MyShop

Toko online lokal berbasis React 19 dan Vite.

## Menjalankan aplikasi

```sh
npm install
npm run dev
```

Katalog dan pesanan disimpan di `localStorage` browser yang sedang digunakan. Data tidak dibagikan antarperangkat atau browser.

## Fitur yang bisa dicoba

- Halaman beranda, katalog, detail produk dinamis, keranjang, login, dan dashboard admin memakai React Router; halaman admin memakai route bertingkat dan redirect ke login bila belum masuk.
- Pencarian, filter kategori, pengurutan, dan pagination bekerja langsung pada katalog tersimpan.
- Form checkout dan CRUD produk admin memakai React Hook Form + Zod, termasuk validasi dan default value edit.
- Dashboard admin menyediakan Create, Read, Update, dan Delete; perubahan katalog tetap tersimpan setelah halaman dimuat ulang.

Checkout menyimpan pesanan di browser, tetapi pembayaran dan pengiriman belum terhubung ke layanan eksternal. Login admin hanya autentikasi sisi klien untuk penggunaan lokal dan bukan perlindungan yang aman untuk produksi.
