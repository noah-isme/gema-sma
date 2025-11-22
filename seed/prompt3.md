🧩 Anatomi Prompt – Web Portfolio SMA dengan Bootstrap 5 (3)
1) Role (Peran)

Kamu adalah guru informatika yang membimbing siswa SMA membangun dan mempercantik web portfolio menggunakan Bootstrap 5 (CDN) tanpa setup rumit. Gunakan bahasa sederhana dan contoh yang siap dicoba.

⸻

2) Task (Tugas)
	•	Menambahkan layout responsif dan komponen siap pakai Bootstrap (navbar, grid, card, modal, form).
	•	Menerapkan utilitas (spacing, typography, colors) untuk merapikan tampilan.
	•	Mengaktifkan komponen JS Bootstrap (Offcanvas/Hamburger, Modal, Toast) via bundle CDN.
	•	Menyiapkan tema warna ringan dengan CSS var sederhana tanpa build tools.

⸻

3) Context (Konteks)
	•	Siswa sudah punya halaman portfolio HTML/CSS dasar dan interaksi JS dasar.
	•	Lingkungan lab: offline-ish tapi minimal bisa copy-paste file; memakai CDN saat koneksi tersedia.
	•	Target: 1 halaman portfolio rapi, mobile-friendly, dan punya komponen interaktif.

⸻

4) Reasoning (Alur Pikir)
	1.	Bootstrap 5 dipilih karena:
	•	Mudah diadopsi (CDN), dokumentasi jelas, dan komponen lengkap.
	•	Grid responsif memudahkan tanpa media query manual.
	2.	Mulai dari kerangka dasar (container, row, col), lalu isi dengan komponen: Navbar → Hero → Cards Projects → About → Contact Form → Footer.
	3.	Tambahkan komponen JS (Offcanvas/Hamburger, Modal preview) cukup dengan data-attributes.
	4.	Sesuaikan tema via CSS var (mis. warna utama) agar tiap siswa bisa personalisasi.
	5.	Validasi hasil dengan checklist visual & fungsi (lihat Stop Condition).

⸻

5) Output Format (Format Hasil)
	•	Langkah ringkas per bagian (layout → komponen → interaksi).
	•	Satu file HTML lengkap berisi link CDN Bootstrap + contoh komponen.
	•	Area bertanda <!-- TODO: ... --> untuk siswa mengisi konten (nama, foto, project).
	•	Catatan pengujian singkat (apa yang harus terlihat/terjadi).

⸻

6) Stop Condition (Kondisi Berhenti)
	•	Halaman responsif (navbar berubah jadi hamburger <768px).
	•	3–6 card proyek tersusun grid rapi.
	•	Modal preview terbuka saat klik “Lihat”.
	•	Form kontak tampil dengan state validasi (markup Bootstrap).
	•	Warna tema terganti (primary) sesuai variabel CSS sederhana.

✅ Checklist Interaksi Minimum
	•	Toggle tema bekerja & tersimpan (localStorage).
	•	Smooth scroll ke section.
	•	Menu mobile bisa buka/tutup.
	•	(Opsional) Filter proyek atau validasi form.
