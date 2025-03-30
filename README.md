# 📚 Selamat Datang di Project Website BukuKu!

Website ini dikembangkan oleh:
- **M. Rabyndra Janitra Binello**
- **Abdul Fattah Firdaus**
- **Fairus Putra Pratama**

##  Panduan Instalasi

### 1️⃣ Persiapan Database
- Buka **XAMPP** dan buat database baru dengan nama **BukuKu**.
- Import file `BukuKu.sql` yang terdapat di folder `database`.
- Jika import berhasil, database akan memiliki 3 tabel: **User**, **Book**, dan **Categories**.

### 2️⃣ Menjalankan Proyek
- Buka proyek di **Visual Studio Code**.
- Buka terminal (CMD) dan jalankan perintah berikut untuk menginstal dependensi:
  ```bash
  npm install
  ```
- Pastikan **MySQL** dan **Apache** pada **XAMPP** sudah aktif.
- Sesuaikan **username** dan **password** MySQL di file `.env` dengan konfigurasi Anda.
  - **Default**: `USERNAME=root`, `PASSWORD=` (kosong).
- Jalankan perintah berikut untuk memulai server:
  ```bash
  npm start
  ```

## 🌐 Mengakses Website BukuKu
- Buka browser dan akses:
  ```
  http://localhost:5000
  ```
- Anda akan diarahkan ke halaman **login**.
- Lakukan **registrasi** atau gunakan akun berikut untuk login:
  - **Username**: `ElloRabyndra`
  - **Password**: `ello`

**Selamat! Anda sudah dapat menggunakan website BukuKu!**

