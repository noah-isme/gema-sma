# 🎨 Playful & Joyful Learning Dashboard — Design System v2

Dokumen ini merinci rancangan UI/UX dashboard siswa GEMA dengan kedalaman level lead product designer. Fokusnya adalah menghadirkan pengalaman belajar yang fun namun dewasa, dengan visual yang hidup, terarah, dan mudah dipahami.

---

## 1. Prinsip Desain Utama dengan Intent Tajam

| Aspek | Pendekatan Detail | Efek Psikologis |
| --- | --- | --- |
| **Playfulness** | Warna cerah, ikon friendly 20–24px, micro-tilt ringan, animasi lembut | Memancing rasa penasaran sehingga siswa nyaman eksplorasi |
| **Joyfulness** | Gradien “soft wave”, transisi manis, emoji selektif, nada visual optimistis | Meningkatkan mood belajar, membuat platform terasa positif |
| **Clarity** | Struktur modular, whitespace luas, pemisahan section tegas | Mengurangi beban kognitif agar siswa tidak overwhelmed |
| **Harmony** | Tone warna konsisten, shadow lembut, gaya ikon satu keluarga | Menyatukan pengalaman visual, dashboard terasa profesional |

> Catatan: Playfulness ≠ kekanak-kanakan. Desain harus modern, edukatif, dan dewasa.

---

## 2. Palet Warna & Mood — Sistem Warna GEMA 2.0

### 🎨 Warna Inti
| Warna | Hex | Fungsi | Psikologi |
| --- | --- | --- | --- |
| Cyan / Sky Blue | `#45C7FA` | CTA primer, highlight progres | Energi, fokus |
| Soft Purple / Lavender | `#A492FF` | Header, state kreatif | Ketenangan, kreativitas |
| Mint / Aqua | `#7AF2C3` | Status positif, focus state | Penyegar visual |
| Soft Yellow | `#FFE37F` | Notifikasi positif, badge | Kehangatan, penghargaan |

### ⚪ Netral
- Putih untuk ruang napas & kontras
- Soft Gray 50–200 untuk layer netral dan pemisah konten

### Prinsip Warna
- Kontras tinggi hanya untuk CTA & achievement badge.
- Gradien wajib berkarakter “soft wave”: sudut halus, transisi mulus, saturasi moderat.
- Mood keseluruhan: cerah, segar, mengundang, tidak norak.

---

## 3. Sistem Tipografi GEMA

| Level | Typeface | Karakter |
| --- | --- | --- |
| **H1–H3** | Poppins atau Nunito Bold | Friendly burst, letter-spacing +0.2px, leading lega |
| **Body P1–P3** | Inter atau Manrope | Modern-akademis, line-height tinggi untuk keterbacaan |

**Tone copywriting**
- Persuasif, ringan, manusiawi.
- Hindari bahasa birokrasi; gunakan emoji hanya sebagai highlight.
- Contoh rewrite: `Progress Kelas XII-A` → `Perjalanan Belajarmu Minggu Ini ✨`.

---

## 4. Layout & Struktur Visual

### ⭐ Hero Section Terarah
- Tinggi maksimal 260–300px.
- Dua fokus utama: sapaan personal + preview progres minggu ini.
- Contoh copy: “Hai Ahmad! Siap belajar hal baru hari ini? 🚀”.
- Tambahkan ilustrasi partikel opacity 12–20% untuk rasa udara.

### ⭐ Stats Cards (Streak, Progress, Encouragement)
- Komponen seragam: ikon 20–24px, pastel accent, background gradient lembut.
- Hierarki: ikon → angka besar → label pendek → subtext mini.
- Hover: `scale 1.02`, shadow lembut dengan blur +8.

### ⭐ Assignment Cards (Komponen Terpenting)
- Split layout 2 kolom:
  - Kiri: nama tugas, deskripsi singkat, kategori.
  - Kanan: status, deadline, CTA.
- Warna mengikuti status (success / warning / danger / info).
- Ikon tipe tugas (Makalah/Esai/Coding/Presentasi) untuk konteks cepat.
- Deadline dekat: badge dengan animasi pulse 2.5s.

### ⭐ Learning Roadmap (Future-proof)
- Saat kosong tetap hidup:
  - Placeholder ilustrasi onboarding.
  - Copy positif: “Roadmap sedang disiapkan untuk perjalanan belajarmu! 🎯”.

---

## 5. Motion System GEMA

| Fungsi | Motion | Parameter | Tujuan |
| --- | --- | --- | --- |
| Scroll reveal | Fade-up lembut | Delay berurutan 0ms / 80ms / 160ms / 240ms | Ritme visual, bukan gimmick |
| Hover card | Scale 1.02, shadow blur +8, gradient shift 8% | Durasi 200ms, easing ease-out-quint | Rasa responsif & aktif |
| Idle micro | Sparkle achievement berkilau, partikel bergerak halus | Cycle 4–6s, opacity < 40% | Dashboard terasa hidup |
| Button | Gradient sweep horizontal | Sweep 500ms, hover feedback 150–200ms | Energi pada CTA |

**Motion constraints**
- Hindari animasi keras/bounce agresif.
- Semua easing `ease-out-quint`.
- Hormati preferensi `prefers-reduced-motion`.

---

## 6. Storytelling Visual

- Dashboard = cerita tentang siswa, bukan papan data.
- Tambahkan mini spotlight seperti: “Kamu menyelesaikan 2 tugas lebih cepat minggu ini. Mantap! 🔥”.
- Gunakan foto/ilustrasi bertone lembut (bukan stock generik) untuk menambah human touch.
- Elemen dekoratif halus: sparkle, bintang pastel, coding cat icon 🐱‍💻, sticker mini — selalu subtle.

---

## 7. Tone UX & Copywriting

| Elemen | Dari | Menjadi |
| --- | --- | --- |
| CTA | “Mulai” | “Ayo Mulai Belajar 🚀” |
| Deadline | “Tugas terlambat.” | “Ups! Kamu melewati deadline, tapi masih bisa kejar 😄” |
| Info kosong | “Tidak ada tugas.” | “Belum ada tugas hari ini — kamu bebas eksplor coding dulu!” |

Formula bahasa: friendly + encouraging + actionable.

---

## 8. Motion Rhythm (Irama Visual)

- Elemen besar (hero) muncul paling lambat untuk memberi sense of arrival.
- Elemen sedang (cards) muncul cascade cepat mengikuti grid order.
- Elemen kecil (ikon, badge) menjalankan idle animation ringan.
- Transisi antar section memakai wave gradient lembut.
- Hover harus langsung merespons untuk menjaga keterhubungan.

---

## 9. Aksesibilitas

Checklist implementasi:
1. Kontras warna minimal 4.5:1 untuk teks utama.
2. Ukuran font minimal 14–16px.
3. Alt-text untuk seluruh ikon/ilustrasi informatif.
4. `prefers-reduced-motion` mematikan animasi non-esensial.
5. Fokus keyboard dengan outline biru mint yang jelas.

---

## 10. Hasil Pengalaman yang Diharapkan

- Siswa merasakan dashboard ini fun, bukan tugas berat.
- Guru melihat dashboard yang rapi, mudah dipahami, dan siap dipresentasikan.
- Brand GEMA tampil sebagai edtech modern, cerah, profesional, dan joyful.

---

## 11. Langkah Lanjut (Track Desainer Senior)

1. **Visual moodboard** — tone warna, treatment gradien soft wave, gaya ikon & ilustrasi.
2. **Motion guide** — dokumentasi scroll reveal, hover/tap/active states, timing & easing chart.
3. **UI kit “Joyful Components”** — StatsCard, AssignmentCard, RoadmapCard, AchievementBadge, PlayfulIcons pack, CTA variants.
4. **High-fidelity dashboard mockup** — siap diprototyping & handoff ke tim front-end.

> Siap lanjut ke eksplorasi visual detail? Tinggal tentukan prioritas moodboard atau motion guide terlebih dahulu.
