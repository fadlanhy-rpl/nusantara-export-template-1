# NusantaraOrigin — Template 1 ("Agile Trader" Edition)
### The Agro & Charcoal Industrial Series — Dark Cinematic & WebGL Edition

Website katalog dan portal B2B ekspor berkecepatan tinggi untuk eksportir komoditas Indonesia (Briket Arang Kelapa, Kopi Spesialisasi, dan Rempah Nusantara). Dibangun menggunakan **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, **Three.js WebGL (Slot-Mapped 3D Engine)**, dan **Lenis Smooth Scroll**.

---

## 🎨 Konsep Desain & Estetika Visual (Dark Cinematic & Paper Band)

- **Dark Cinematic Canvas (`#0B0B0C`)**: Latar belakang gelap berwibawa dengan grid garis halus (`rgba(245, 245, 244, 0.12)`).
- **Aksen Ember Flame (`#E8742A`, `#C95E1B`)**: Menghadirkan identitas suhu pembakaran briket arang dan energi perdagangan industri.
- **The Paper Band (`#F3F1EC` & `#0B0B0C`)**: Seksi kalkulator kontainer beralih kontras ke warna kertas terang (*raw unbleached paper*) yang memuat diagram cetak biru kontainer.
- **Tipografi 3-Lapis**:
  - `Geist` — Sans-serif tajam dan bersih untuk tajuk dan teks narasi.
  - `Instrument Serif` (Italic) — Sentuhan editorial puitis untuk kata aksen (*earth*, *cargo*).
  - `Geist Mono` — Tabular numerics untuk metrik kontainer, kode HS, persentase lab, dan harga FOB USD.
  - `IBM Plex Sans Arabic` — Tipografi korporat Arab elegan saat mode RTL `/ar` aktif.

---

## 🌌 Arsitektur 3D WebGL Slot Scene (`three.js`)

Canvas Three.js ditempatkan secara tetap (`fixed inset-0 pointer-events-none`) di belakang konten web:
- **Model 3D Prosedural**:
  1. *Glowing Coconut Charcoal Briquette Cube*: Pori-pori kasar dengan bump map dan retakan bara api yang menyala (`emissiveMap`).
  2. *Hexagonal BBQ Briquette*: Briket heksagonal berongga tengah khas resto.
  3. *Sumatra Green Coffee Beans*: Biji kopi dengan lekukan celah tengah alami (*longitudinal crease*).
  4. *Cinnamon Quill Bundle & Maluku Cloves*: Ikatan kayu manis dan batang cengkeh utuh.
  5. *3D Shipping Container*: Kontainer baja bertekstur gelombang dengan logo resmi *NUSANTARA ORIGIN*.
- **Slot Tracking System**:
  - `#slot-hero`: Cluster hero mengambang bersama kontainer dan bara api dengan paralaks mouse.
  - `#slot-com`: Sticky preview komoditas yang berganti model 3D secara dinamis saat baris di-hover/klik.
  - `#slot-proc`: Kubus briket yang memanas dan memancarkan cahaya bara (*ember point light*) yang semakin terang sesuai tahap QC scroll.
  - `#slot-close`: Kontainer ekspor 3D yang berotasi perlahan pada seksi penutup.
- **Optimasi Efisiensi**: Saat seksi *Paper Band Container Planner* memenuhi layar, rendering 3D otomatis dipause untuk menghemat daya GPU/CPU.

---

## 🔬 Riset Ilmiah & Penerapan Hukum UI/UX (UX Laws)

Desain ini dikembangkan berdasarkan riset Human-Computer Interaction (HCI) dari arXiv:

1. **Fitts's Law & Touch Targets (Ukuran Target Sentuh)**:
   - *Riset*: **Rajanna & Hammond (2022)**, *"Can Gaze Beat Touch? A Fitts' Law Evaluation of Gaze, Touch, and Mouse Inputs"* ([arXiv:2208.01248](https://arxiv.org/abs/2208.01248)). Menunjukkan bahwa input sentuhan memiliki *throughput* optimal (6.67 bits/s) jika target memiliki ukuran fisik memadai (min 44px–48px) dan mudah dijangkau.
   - *Penerapan*: Seluruh tombol navigasi, pill komoditas, stepper kuantitas kontainer, dan tombol CTA memiliki ukuran tinggi minimal 44px–48px dengan padding nyaman di ponsel.

2. **Cognitive Load & Information Representation (Beban Kognitif)**:
   - *Riset*: **Du & Tang (2025)**, *"Cognitive Load and Information Processing: Reader-Task-Interface Framework"* ([arXiv:2507.07037](https://arxiv.org/abs/2507.07037)). Beban kognitif berkurang drastis ketika representasi data dilokalisasi dan didekonstruksi secara visual daripada disajikan dalam teks panjang padat.
   - *Penerapan*: Kontainer kalkulator menggunakan visualisasi skematik SVG 2D interaktif yang langsung menyalakan petak kardus secara deterministik sesuai volume muatan, membagi data ke dalam "*The Big 3*" (Net Weight, Unit Box, Indicative FOB).

3. **Hick's Law**:
   - Waktu pengambilan keputusan meningkat seiring bertambahnya jumlah pilihan.
   - *Penerapan*: Pilihan komoditas dibatasi 4 komoditas utama, 3 ukuran kontainer standar (20ft, 40ft, 40ft HC), dan form RFQ dipecah menjadi 3 langkah progresif (Shipment → Terms → Contact).

4. **Miller's Law (Chunking)**:
   - Memori kerja manusia optimal menampung $7 \pm 2$ unit informasi.
   - *Penerapan*: Metrik pengapalan disederhanakan ke dalam kelompok statistik terpisah (Output, MOQ, Lead Time, Payment Terms).

5. **Aesthetic-Usability Effect**:
   - Pengguna mempersepsikan antarmuka yang estetis dan berwibawa sebagai sistem yang lebih andal dan dapat dipercaya (krusial bagi pembeli B2B luar negeri).
   - *Penerapan*: Visual cinematic dark canvas, tipografi editorial *Instrument Serif*, dan animasi *masked line reveal*.

6. **Doherty Threshold**:
   - Interaksi komputer-manusia berkinerja optimal saat respon sistem terjadi di bawah 400ms.
   - *Penerapan*: Kalkulator kontainer bekerja secara instan (0ms latency, pure deterministic client calculation), perubahan unit dan utilisasi ruang ter-update secara real-time.

---

## 🛠️ Menjalankan Proyek

```bash
cd "d:\Template\Export-Import\Template-the agro-and-charcoal-industrial-series\Template-1"

# Jalankan mode pengembangan:
pnpm run dev

# Jalankan mode produksi:
pnpm run build
pnpm run start
```
Buka di browser: `http://localhost:3000` (atau tambahkan `?pitch=true` untuk membuka secret live pitch bar).
