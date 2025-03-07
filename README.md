# HelmAI Client 🛡️🤖

Google Apps Script Client untuk berinteraksi dengan API HelmAI dan asisten pintar toko helm.

![HelmAI Client Banner](https://blog.classy.id/upload/gambar_berita/85f96b6847da7cafe73175c28e2b8d8b_20250307234536.png)

## 📋 Deskripsi

HelmAI Client adalah Google Apps Script yang memungkinkan pengguna untuk mengakses informasi produk helm dan berinteraksi dengan asisten pintar HelmAI melalui antarmuka spreadsheet Google. Ideal untuk staf toko dan pengguna yang ingin akses cepat ke katalog produk dan bantuan dari asisten AI.

## ✨ Fitur

- **Akses Informasi Produk** - Mendapatkan dan menampilkan data produk helm terbaru dalam spreadsheet
- **Visualisasi Promosi** - Menampilkan promosi aktif dengan detail diskon dan periode
- **Chat dengan Asisten Cerdas** - Sidebar interaktif untuk berkomunikasi dengan HelmAI 
- **Multi-Mode Asisten** - Pilihan mode CS, Konten, dan Sales untuk berbagai kebutuhan komunikasi
- **Manajemen Sesi** - Kemampuan melanjutkan percakapan melalui ID sesi

## 🔧 Teknologi

- Google Apps Script
- Google Spreadsheet
- HTML Service (untuk UI sidebar)
- RESTful API
- JavaScript

## 📚 Cara Kerja

Script ini berfungsi sebagai client yang menghubungkan Google Spreadsheet dengan API HelmAI. Pengguna dapat:

1. Mengupdate dan melihat data produk helm dalam format spreadsheet
2. Membuka sidebar chat untuk berinteraksi dengan asisten virtual
3. Melakukan percakapan dalam berbagai mode sesuai kebutuhan

```
┌─────────────────┐      ┌───────────────┐      ┌───────────────┐
│  Google Sheet   │<────>│  Apps Script  │<────>│  HelmAI API   │
│  (User View)    │      │  Client       │      │  Endpoints    │
└─────────────────┘      └───────────────┘      └───────┬───────┘
      │                         │                       │
      │                         │                       │
      │                  ┌──────┴──────┐                │
      └──────────────-->│ Chat Sidebar │<───────────────┘
                        └─────────────┘
```

## 🚀 Deployment

### Prasyarat

- Akun Google
- Akses ke HelmAI API (URL server dan API key)

### Setup di Google Spreadsheet

1. Buat Google Spreadsheet baru
2. Buka menu Extensions > Apps Script
3. Copy-paste kode dari `helmAI-client.gs` ke editor
4. Update variabel CONFIG dengan URL server dan API key Anda:

```javascript
const CONFIG = {
  baseUrl: "http://your-server-url", // Ganti dengan URL atau IP server Anda
  apiKey: "your_api_key_here", // Ganti dengan API key Anda
  timeout: 30000 // Timeout dalam milidetik
};
```

5. Simpan project dan berikan nama (contoh: "HelmAI Client")
6. Reload spreadsheet Anda
7. Anda akan melihat menu "Toko Helm" di menu bar

### Langkah Penggunaan

1. Klik menu "Toko Helm" > "Update Data Produk" untuk mengisi spreadsheet dengan data produk terbaru
2. Klik menu "Toko Helm" > "Chat dengan Asisten" untuk membuka sidebar chat
3. Pilih mode asisten (CS, Konten, atau Sales) sesuai kebutuhan Anda
4. Mulai percakapan dengan asisten HelmAI

### Otorisasi

Saat pertama kali menjalankan script, Google akan meminta otorisasi untuk:
- Akses spreadsheet Anda
- Melakukan permintaan ke layanan eksternal (API HelmAI)

Berikan izin yang diperlukan untuk menggunakan fitur secara lengkap.

## 📱 Penggunaan

### Update Data Produk

```
Toko Helm > Update Data Produk
```

Perintah ini akan mengambil data produk dan promosi terbaru dari server dan menampilkannya dalam format tabel di spreadsheet Anda.

### Chat dengan Asisten

```
Toko Helm > Chat dengan Asisten
```

Perintah ini akan membuka sidebar dengan antarmuka chat. Anda dapat:

1. Memilih mode asisten (CS, Konten, Sales)
2. Mengetik pesan di kotak input
3. Menekan tombol "Kirim" atau Enter untuk mengirim pesan
4. Melihat respons dari asisten HelmAI

### Mode Asisten

- **CS (Customer Service)**: Untuk pertanyaan layanan pelanggan, penanganan keluhan, dan dukungan umum
- **Konten**: Untuk informasi produktif, edukasi tentang jenis helm, keselamatan, dan konten informatif lainnya
- **Sales**: Untuk rekomendasi produk, penawaran spesial, dan bantuan konversi penjualan

## ⚙️ Konfigurasi Lanjutan

Anda dapat menyesuaikan berbagai aspek client dengan mengedit variabel dan fungsi:

- Mengubah tampilan UI sidebar di fungsi `showChatSidebar()`
- Menambahkan kolom data tambahan di fungsi `populateProductsSheet()`
- Menambahkan mode asisten baru di elemen `select` dalam sidebar

## 📖 API Endpoints

HelmAI Client menggunakan endpoint berikut:

- `GET /api/helm/info` - Mendapatkan informasi produk dan promosi
- `POST /api/helm/chat` - Mengirim pesan ke asisten dan menerima respons
- `GET /api/helm/sessions` - Mendapatkan daftar sesi chat aktif

## 🔒 Keamanan

Script menggunakan API key untuk otentikasi dengan server. Pastikan untuk:

- Menyimpan API key dengan aman
- Tidak membagikan spreadsheet yang berisi konfigurasi API key
- Menggunakan API key dengan izin minimal yang diperlukan

## 🤝 Integrasi

HelmAI Client dapat diintegrasikan dengan:

- HelmAI Dashboard Admin (untuk manajemen produk)
- Sistem POS toko helm
- Laporan analitik dan business intelligence

## 🛠️ Troubleshooting

Jika mengalami masalah:

1. Periksa konfigurasi API (URL dan key)
2. Verifikasi koneksi internet
3. Periksa log dengan `Logger.log()` dan lihat di menu View > Logs di editor Apps Script
4. Pastikan server API berjalan dan dapat diakses

## 📞 Dukungan

Untuk pertanyaan dan dukungan, silakan hubungi kami di [kontak@classy.id](mailto:kontak@classy.id) atau buka issue di repository GitHub.

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
