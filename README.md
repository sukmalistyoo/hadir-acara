# Hadir Acara

Portofolio alur kehadiran berbasis QR untuk rapat dinas, dengan prototipe buku tamu pernikahan.

**[Demo](https://sukmalistyoo.github.io/hadir-acara/dinas.html)** · [Tanyakan paket acara](https://github.com/sukmalistyoo/hadir-acara/issues/new?title=Permintaan%20demo%20Hadir%20Acara)

Pada demo rapat dinas, ubah keterangan kegiatan untuk melihat perubahan pada lembar A4. Tambahkan peserta contoh, coba tanda tangan, simpan arsip di browser, atau cetak ke PDF. Tab Wedding menyediakan undangan digital dan formulir RSVP untuk tamu. Gunakan data fiktif.

## Rapat dinas

Pada aplikasi operasional, peserta memindai QR, mengisi identitas dan membubuhkan tanda tangan dari HP. Panitia melihat daftar hadir dan mencetak PDF dengan kop acara. QR materi membuka tayangan yang mengikuti halaman operator. Untuk demonstrasi lintas perangkat, klik **Materi Rapat → Mulai sesi → QR Materi**. Pindai QR dari HP kedua. Peserta mengikuti tiga slide contoh saat operator menekan panah. Sesi berlangsung satu jam. QR Rapat untuk simulasi input lokal terpisah dari QR Materi.

## Undangan digital dan buku tamu wedding

[Buka demo Wedding](https://sukmalistyoo.github.io/hadir-acara/wedding.html)

1. Buka **Custom undangan** untuk mengatur nama pasangan, tanggal, jam, lokasi dan warna sampul.
2. Pilih **Bagikan undangan** untuk mendapatkan QR dan tautan tamu. Tamu mengisi nama, alamat/kota, jumlah orang, dan konfirmasi hadir atau berhalangan. Dari browser yang sama konfirmasi bisa diperbarui sebelum check-in.
3. Pemilik melihat rekap di browser tempat acara dibuat. Saat tamu datang, pilih **Check-in** dan catat tanda tangan untuk membedakan RSVP dari kedatangan di lokasi.

Demo memakai satu tautan bersama per acara, hingga 100 konfirmasi selama 24 jam. Gunakan data fiktif. Kunci akses pemilik disimpan di browser pembuat acara. Tautan tamu hanya membuka undangan dan formulir RSVP.

## Rancangan akses klien

| Pengguna | Akses yang ditawarkan |
|---|---|
| Pemilik acara | Undangan login khusus acara untuk mengatur identitas acara, melihat rekap, mengundang petugas, serta mengekspor hasil. |
| Petugas penerima tamu | Akun terbatas pada acara dan jadwal tugasnya untuk memindai undangan serta mencatat jumlah orang yang datang. |
| Tamu | Tautan atau QR undangan untuk RSVP dan check-in miliknya sendiri. |
| Penyedia layanan | Menyiapkan acara, mengaktifkan paket dan menentukan kapan akses pengelolaan berakhir. |

## Penawaran premium per acara

Ruang lingkup dan biaya disepakati sebelum aktivasi. Opsi untuk rapat meliputi kop instansi, daftar hadir bertanda tangan, ekspor PDF dan pendampingan operator. Paket wedding dapat mencakup desain undangan khusus, RSVP dan buku tamu digital. Impor daftar keluarga, QR unik per undangan, akses terpisah untuk petugas dan rekap per sesi merupakan opsi pengembangan.

Repositori ini berisi portofolio dan simulasi mandiri. Autentikasi klien, penyimpanan tamu, pembayaran dan aktivasi paket wedding merupakan ruang lingkup pengembangan layanan. Untuk menanyakan demo, cukup sertakan jenis acara dan fitur yang dibutuhkan di tautan permintaan demo. Daftar tamu serta kontak pribadi dibahas melalui kanal privat.

## Menjalankan demo

Buka `dinas.html` di browser. Form dan arsip contoh berjalan lokal. Fitur presentasi live memerlukan internet untuk menyinkronkan halaman melalui layanan sesi demo.
