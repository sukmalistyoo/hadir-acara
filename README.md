# Hadir Acara

Portofolio alur kehadiran berbasis QR untuk rapat dinas, dengan prototipe buku tamu pernikahan.

**[Coba demo interaktif](https://sukmalistyoo.github.io/hadir-acara/index.html)** · [Tanyakan paket acara](https://github.com/sukmalistyoo/hadir-acara/issues/new?title=Permintaan%20demo%20Hadir%20Acara)

Di demo, pilih jenis acara dan tekan **Simulasikan hadir**. Lihat perubahan jumlah peserta dan urutan kedatangan. Semua nama adalah contoh. Muat ulang halaman untuk memulai kembali.

## Rapat dinas

Pada aplikasi operasional, peserta memindai QR, mengisi identitas dan membubuhkan tanda tangan dari HP. Panitia melihat daftar hadir dan mencetak PDF dengan kop acara. QR materi membuka tayangan yang mengikuti halaman operator. Demo publik memperagakan pencatatan kehadiran dengan data fiktif di browser.

## Buku tamu wedding · prototipe

Templat undangan menampilkan nama pasangan, sesi resepsi dan jumlah orang yang datang bersama. Untuk implementasi klien, QR undangan per keluarga dapat menghubungkan RSVP dengan check-in di meja penerima tamu. Tamu tambahan perlu dicatat terpisah agar jumlah undangan dan jumlah orang hadir dapat direkap dengan tepat.

## Rancangan akses klien

| Pengguna | Akses yang ditawarkan |
|---|---|
| Pemilik acara | Undangan login khusus acara untuk mengatur identitas acara, melihat rekap, mengundang petugas, serta mengekspor hasil. |
| Petugas penerima tamu | Akun terbatas pada acara dan jadwal tugasnya untuk memindai undangan serta mencatat jumlah orang yang datang. |
| Tamu | Tautan atau QR undangan untuk RSVP dan check-in miliknya sendiri. |
| Penyedia layanan | Menyiapkan acara, mengaktifkan paket dan menentukan kapan akses pengelolaan berakhir. |

## Penawaran premium per acara

Ruang lingkup dan biaya disepakati sebelum aktivasi. Opsi untuk rapat meliputi kop instansi, daftar hadir bertanda tangan, ekspor PDF dan pendampingan operator. Opsi pengembangan wedding meliputi desain pasangan, impor undangan keluarga, RSVP, QR per undangan, beberapa meja check-in dan rekap per sesi.

Repositori ini berisi portofolio dan simulasi mandiri. Autentikasi klien, penyimpanan tamu, pembayaran dan aktivasi paket wedding merupakan ruang lingkup pengembangan layanan. Untuk menanyakan demo, cukup sertakan jenis acara dan fitur yang dibutuhkan di tautan permintaan demo. Daftar tamu serta kontak pribadi dibahas melalui kanal privat.

## Menjalankan demo

Buka `index.html` di browser. Demo dapat berjalan tanpa instalasi, akun, atau koneksi ke database desa.
