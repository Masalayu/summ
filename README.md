# Manual Book: Aplikasi Document Summarizer Berbasis Web

## Pendahuluan
Selamat datang di Manual Book untuk Aplikasi Document Summarizer! Aplikasi ini adalah sistem cerdas sederhana berbasis web yang memungkinkan pengguna untuk mengupload dokumen (PDF, TXT, atau DOCX), mengekstrak teksnya, dan menghasilkan ringkasan otomatis menggunakan teknologi AI/ML. Aplikasi ini dibangun menggunakan PHP untuk antarmuka web dan Python untuk proses summarization, dengan environment lokal menggunakan Laragon.

**Tujuan Aplikasi:** Membantu pengguna merangkum dokumen panjang secara cepat, cocok untuk mahasiswa, peneliti, atau profesional yang sering berurusan dengan teks berukuran besar.

**Versi Aplikasi:** 1.0 (MVP - Minimum Viable Product).  
**Pengembang:** Berdasarkan panduan Grok (xAI).  
**Tanggal Pembuatan Manual:** 11 Desember 2025.

## Persyaratan Sistem
Untuk menjalankan aplikasi ini di environment lokal, pastikan spesifikasi berikut terpenuhi:

### Hardware:
- Prosesor: Minimal Intel Core i3 atau setara.
- RAM: Minimal 4 GB (direkomendasikan 8 GB untuk model AI yang lebih besar).
- Storage: Minimal 500 MB kosong untuk instalasi dan library.

### Software:
- **Sistem Operasi:** Windows (karena Laragon khusus Windows; untuk OS lain, adaptasi manual diperlukan).
- **Laragon:** Versi terbaru (download dari [laragon.org](https://laragon.org)). Pilih edisi Full untuk inklusi PHP dan server.
- **Python:** Versi 3.10+ (instal dari [python.org](https://python.org) jika belum ada di Laragon).
- **PHP:** Versi 7.4+ (sudah termasuk di Laragon).
- **Library Python:** transformers, torch, PyPDF2, python-docx, sentencepiece (instal via pip).
- **Browser:** Chrome, Firefox, atau Edge untuk mengakses web lokal.

**Catatan:** Aplikasi ini berjalan sepenuhnya lokal tanpa internet setelah setup, kecuali jika Anda modifikasi untuk API eksternal.

## Instalasi dan Setup
Ikuti langkah-langkah berikut untuk menginstal dan menyiapkan aplikasi.

### Langkah 1: Instal Laragon
1. Download Laragon dari situs resmi.
2. Jalankan installer dan ikuti wizard (pilih opsi default).
3. Setelah instal, jalankan Laragon dan klik "Start All" untuk mengaktifkan server (Apache/Nginx dan MySQL jika diperlukan, meskipun tidak wajib untuk MVP ini).

### Langkah 2: Integrasi Python ke Laragon
1. Jika Python belum terinstal, download dan instal Python 3.12+.
2. Tambahkan Python ke PATH:
   - Buka Laragon > Menu > Tools > PATH Manager.
   - Klik "Add" dan pilih folder bin Python (misal: C:\Python312).
3. Restart Laragon.
4. Test di Terminal Laragon (Menu > Terminal): Ketik `python --version`. Harus muncul versi Python.

### Langkah 3: Instal Library Python
1. Buka Terminal di Laragon.
2. Jalankan perintah:
   ```
   pip install transformers torch PyPDF2 python-docx sentencepiece
   ```
3. Tunggu hingga selesai. Jika error, pastikan pip up-to-date dengan `python -m pip install --upgrade pip`.

### Langkah 4: Buat Project
1. Di Laragon, klik "Quick App" > "Blank" atau buat folder manual di direktori `www/` Laragon (misal: `C:\laragon\www\document-summarizer`).
2. Buat file-file berikut di folder project:
   - `index.php`: Kode PHP untuk UI dan backend.
   - `summarizer.py`: Kode Python untuk summarization.
3. Salin kode dari panduan sebelumnya ke file-file tersebut.
4. Buat subfolder `uploads/` di folder project untuk menyimpan file sementara.

### Langkah 5: Test Setup
1. Jalankan Laragon (Start All).
2. Buka browser dan akses `http://document-summarizer.test` (Laragon auto buat virtual host; jika tidak, gunakan `http://localhost/document-summarizer`).
3. Jika halaman upload muncul, setup berhasil.

## Penggunaan Aplikasi
Aplikasi ini mudah digunakan. Berikut panduan langkah demi langkah.

### Cara Menggunakan:
1. **Akses Aplikasi:**
   - Buka browser dan kunjungi `http://document-summarizer.test`.
   - Anda akan melihat halaman dengan judul "Upload Dokumen untuk Dirangkum" dan form upload.

2. **Upload Dokumen:**
   - Klik "Choose File" dan pilih dokumen (PDF, TXT, atau DOCX).
   - Ukuran file maksimal: Sesuaikan di php.ini Laragon (default 2MB; ubah `upload_max_filesize` jika perlu).
   - Klik "Ringkum".

3. **Proses Summarization:**
   - Aplikasi akan mengekstrak teks dari dokumen.
   - Python akan merangkum teks menggunakan model AI (default: BART-large-CNN).
   - Tunggu 5-30 detik tergantung ukuran dokumen (untuk file besar, bisa lebih lama).

4. **Lihat Hasil:**
   - Ringkasan akan ditampilkan di bawah form.
   - Contoh output: "Ringkasan: [teks ringkasan di sini]".
   - File upload akan dihapus otomatis setelah proses (untuk keamanan).

### Tips Penggunaan:
- **Bahasa Dokumen:** Model default bagus untuk bahasa Inggris. Untuk bahasa Indonesia, ganti model di `summarizer.py` menjadi "cahya/t5-base-indonesian-summarization".
- **Panjang Ringkasan:** Sesuaikan variabel `max_length` di Python untuk mengontrol panjang (misal 200 kata).
- **Multi-Dokumen:** Untuk saat ini, satu file per sesi. Tambah fitur batch di pengembangan lanjutan.

## Troubleshooting (Pemecahan Masalah)
Jika ada masalah, cek solusi berikut:

1. **Error "Python not found":**
   - Pastikan Python di PATH. Test di Terminal: `python --version`.
   - Restart Laragon.

2. **Error Library Python (misal "No module named transformers"):**
   - Instal ulang library via pip di Terminal Laragon.

3. **File Upload Gagal:**
   - Cek permission folder `uploads/` (harus writable).
   - Periksa ukuran file di php.ini (Laragon > Menu > PHP > php.ini).

4. **Summarization Lambat/Error:**
   - Model AI butuh RAM cukup. Tutup app lain.
   - Jika error torch (GPU), jalankan di CPU saja (default).
   - Test script Python manual: Di Terminal, `python summarizer.py path/to/file.pdf`.

5. **Halaman Web Tidak Muncul:**
   - Cek Laragon berjalan (Start All).
   - Clear cache browser.

6. **Error JSON Decode:**
   - Pastikan output Python valid JSON. Test script secara terpisah.

Jika masalah berlanjut, cek log error di Laragon (Menu > Log) atau console browser (F12 > Console).

## Pengembangan Lanjutan
Untuk meningkatkan aplikasi:
- **Tambah Database:** Gunakan MySQL di Laragon untuk simpan history ringkasan.
- **Frontend Lebih Baik:** Integrasikan Bootstrap atau Laravel (instal via Composer di Laragon).
- **API Eksternal:** Ganti Python dengan OpenAI API (panggil via cURL di PHP) untuk summarization lebih cepat (butuh API key).
- **Optimasi:** Tambah progress bar JS atau proses async.
- **Deployment ke Produksi:** Pindah ke hosting seperti Heroku. Pisah Python (Flask API) dan PHP.

## Disclaimer
- Aplikasi ini untuk tujuan edukasi. Ringkasan AI mungkin tidak 100% akurat; selalu verifikasi manual.
- Jangan upload dokumen sensitif, karena proses lokal tapi file sementara disimpan.
- Hak Cipta: Kode berdasarkan panduan open-source; modifikasi bebas.

Terima kasih telah menggunakan Aplikasi Document Summarizer! Jika ada update manual, cek versi terbaru. Untuk pertanyaan, hubungi pengembang atau forum komunitas Laragon.
