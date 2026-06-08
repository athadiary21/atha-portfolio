# Buat Portofolio Lebih Berkarakter

Fokus pada dua hal yang kamu pilih: **Portfolio bento + tilt** dan **Depth & tekstur global**. Intensitas seimbang (level 3) — terlihat jelas tapi tetap elegan, tidak ramai berlebihan.

## 1. Portfolio: Bento Grid + Tilt 3D + Lightbox

Mengganti grid 3 kolom seragam saat ini dengan layout bento (ukuran card bervariasi) agar lebih hidup.

- **Bento layout**: proyek pertama/unggulan jadi card besar (2 kolom), sisanya ukuran normal, beberapa memanjang. Tetap rapi & responsif (di mobile kembali 1 kolom).
- **Tilt 3D ringan**: card miring mengikuti posisi mouse saat hover (efek halus, bukan ekstrem), plus glow ungu di tepi.
- **Overlay detail**: saat hover, muncul judul + deskripsi singkat + tag yang naik dari bawah dengan animasi.
- **Lightbox/modal**: klik card membuka dialog detail proyek (gambar besar, deskripsi penuh, tags) menggantikan perilaku "buka gambar di tab baru" sekarang.
- Filter kategori (All / Photography / Coding) tetap dipertahankan.

## 2. Depth & Tekstur Global

Memberi kedalaman ke seluruh halaman supaya tidak terasa datar.

- **Mesh glow bergerak**: blob gradient ungu/aksen blur besar yang bergerak perlahan di background halaman (di belakang konten, sangat halus).
- **Grain/noise overlay**: tekstur butir tipis di atas background untuk kesan premium.
- **Pemisah dekoratif**: garis/gradient pemisah halus antar section agar transisi tidak monoton.
- **Scroll-reveal lebih variatif**: selain fade-in yang ada, tambah varian geser dari samping & stagger (elemen muncul berurutan), memanfaatkan hook `useScrollAnimation` yang sudah ada.

## Detail Teknis

- **Token desain baru** di `src/index.css`: keyframes untuk blob/glow bergerak, util grain overlay, varian animasi reveal; daftarkan di `tailwind.config.ts` bila perlu.
- **`src/components/home/Portfolio.tsx`**: ubah grid jadi bento (col-span/row-span per item), tambah komponen card dengan tilt (handler mouse-move menghitung rotateX/rotateY), dan `Dialog` (shadcn, sudah tersedia) untuk lightbox.
- **`src/pages/Index.tsx`** atau wrapper baru: layer background global (blobs + grain) dengan `pointer-events-none` dan `z-index` di belakang konten.
- **Pemisah section**: elemen dekoratif kecil yang diselipkan antar section.
- Semua warna pakai token desain yang ada (`primary`, `accent`, dll.) — tidak ada warna hardcoded. Tetap mobile-first sesuai konvensi proyek.
- Tanpa library baru; pakai Tailwind + CSS + shadcn Dialog yang sudah ada.

## Di Luar Cakupan (sesuai pilihanmu)

Hero sinematik dan section Testimonials tidak dikerjakan dulu — bisa menyusul kapan saja.
