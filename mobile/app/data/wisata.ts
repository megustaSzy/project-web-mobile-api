// ===================================================
// ============ FIXED — DATA WISATA CLEAN ============
// ===================================================

// Semua require harus statis — ini sudah aman
const images = [
  require("../../assets/images/favorite/19.png"),
  require("../../assets/images/favorite/20.png"),
  require("../../assets/images/favorite/21.png"),
  require("../../assets/images/favorite/22.png"),
  require("../../assets/images/favorite/23.png"),
  require("../../assets/images/favorite/24.png"),
  require("../../assets/images/favorite/25.png"),
  require("../../assets/images/favorite/26.png"),
  require("../../assets/images/favorite/27.png"),
  require("../../assets/images/favorite/28.png"),
];

// ===================
// DATA AWAL (RAW)
// ===================
const raw = [
  {
    kabupaten: "Pesawaran",
    destinasi: [
      { name: "Pantai Sari Ringgung", kategori: "Pantai", harga: "25.000" },
      { name: "Pantai Mutun", kategori: "Pantai", harga: "20.000" },
      { name: "Pantai Ketapang", kategori: "Pantai", harga: "10.000" },
      { name: "Pantai Dewi Mandapa", kategori: "Pantai", harga: "15.000" },
      { name: "Pantai Ringgung Pasir Timbul", kategori: "Pantai", harga: "25.000" },
      { name: "Pantai Klara", kategori: "Pantai", harga: "15.000" },
      { name: "Pulau Pahawang", kategori: "Pulau", harga: "150.000–200.000" },
      { name: "Pulau Kelagian Besar", kategori: "Pulau", harga: "20.000" },
      { name: "Pulau Kelagian Kecil", kategori: "Pulau", harga: "20.000" },
      { name: "Pulau Mahitam", kategori: "Pulau", harga: "20.000" },
      { name: "Pulau Maitung", kategori: "Pulau", harga: "10.000" },
      { name: "Pulau Tegal Mas", kategori: "Pulau", harga: "25.000 + 85.000 (Kapal)" },
      { name: "Pulau Tangkil", kategori: "Pulau", harga: "10.000" },
      { name: "Gunung Pesawaran", kategori: "Gunung", harga: "5.000" },
      { name: "Gunung Rindingan", kategori: "Gunung", harga: "5.000" },
      { name: "Bukit Kabut Batu", kategori: "Bukit", harga: "10.000" },
      { name: "Bukit Bluncu", kategori: "Bukit", harga: "5.000" },
      { name: "Bukit Cidok", kategori: "Bukit", harga: "5.000" },
      { name: "Air Terjun Ciupang", kategori: "Air Terjun", harga: "10.000" },
      { name: "Air Terjun Way Landa", kategori: "Air Terjun", harga: "5.000" },
    ],
  },

  {
    kabupaten: "Lampung Selatan",
    destinasi: [
      { name: "Pantai Marina", kategori: "Pantai", harga: "30.000" },
      { name: "Pantai Tiska", kategori: "Pantai", harga: "10.000" },
      { name: "Pantai Batu Lapis", kategori: "Pantai", harga: "10.000" },
      { name: "Pantai Teluk Hantu", kategori: "Pantai", harga: "10.000" },
      { name: "Pantai Laguna Helau", kategori: "Pantai", harga: "10.000" },
      { name: "Gunung Rajabasa", kategori: "Gunung", harga: "5.000" },
      { name: "Pulau Sebesi", kategori: "Pulau", harga: "5.000" },
      { name: "Pulau Sebuku", kategori: "Pulau", harga: "10.000" },
      { name: "Air Terjun Way Siliwangi", kategori: "Air Terjun", harga: "10.000" },
      { name: "Air Terjun Ringgung", kategori: "Air Terjun", harga: "5.000" },
    ],
  },

  {
    kabupaten: "Tanggamus",
    destinasi: [
      { name: "Pantai Queen Artha", kategori: "Pantai", harga: "20.000" },
      { name: "Pantai Minang Rua", kategori: "Pantai", harga: "20.000" },
      { name: "Gunung Tanggamus", kategori: "Gunung", harga: "10.000" },
      { name: "Gunung Ulubelu", kategori: "Gunung", harga: "10.000" },
      { name: "Bukit Cameron", kategori: "Bukit", harga: "15.000" },
      { name: "Bukit Teletubbies", kategori: "Bukit", harga: "10.000" },
      { name: "Air Terjun Way Lalaan", kategori: "Air Terjun", harga: "10.000" },
      { name: "Air Terjun Lembah Pelangi", kategori: "Air Terjun", harga: "15.000" },
      { name: "Air Terjun Way Landa", kategori: "Air Terjun", harga: "5.000" },
    ],
  },

  {
    kabupaten: "Lampung Barat",
    destinasi: [
      { name: "Pantai Walur", kategori: "Pantai", harga: "5.000" },
      { name: "Pantai Tanjung Setia", kategori: "Pantai", harga: "5.000" },
      { name: "Gunung Seminung", kategori: "Gunung", harga: "10.000" },
      { name: "Air Terjun Putri Malu", kategori: "Air Terjun", harga: "20.000" },
      { name: "Air Terjun Curup Gangsa", kategori: "Air Terjun", harga: "10.000" },
      { name: "Air Terjun Curup Tawang", kategori: "Air Terjun", harga: "10.000" },
      { name: "Air Terjun Batu Putu", kategori: "Air Terjun", harga: "?" },
      { name: "Bukit Idaman", kategori: "Bukit", harga: "10.000" },
    ],
  },

  {
    kabupaten: "Way Kanan",
    destinasi: [
      { name: "Air Terjun Curup Gangsa", kategori: "Air Terjun", harga: "10.000" },
      { name: "Air Terjun Putri Malu", kategori: "Air Terjun", harga: "20.000" },
    ],
  },

  {
    kabupaten: "Pesisir Barat",
    destinasi: [
      { name: "Pantai Gigi Hiu", kategori: "Pantai", harga: "5.000" },
      { name: "Pantai Walur", kategori: "Pantai", harga: "5.000" },
      { name: "Pantai Tanjung Setia", kategori: "Pantai", harga: "5.000" },
    ],
  },

  {
    kabupaten: "Tulang Bawang Barat",
    destinasi: [
      { name: "Bukit Sakura", kategori: "Bukit", harga: "10.000" },
      { name: "Bukit Aslan", kategori: "Bukit", harga: "25.000–35.000" },
    ],
  },

  {
    kabupaten: "Bandar Lampung",
    destinasi: [
      { name: "Pantai Tarahan", kategori: "Pantai", harga: "5.000" },
      { name: "Pantai Cemara", kategori: "Pantai", harga: "10.000" },
      { name: "Bukit Pangonan", kategori: "Bukit", harga: "10.000" },
      { name: "Bukit Klutum", kategori: "Bukit", harga: "10.000" },
      { name: "Air Terjun Batu Putu", kategori: "Air Terjun", harga: "5.000" },
    ],
  },

  {
    kabupaten: "Lampung Tengah",
    id : "1",
    destinasi: [
      { name: "Gunung Betung", kategori: "Gunung", harga: "10.000" },
    ],
  },
];

// ===================================================
// === FINAL DATA — TAMBAH LOGO + GAMBAR DESTINASI ===
// ===================================================
export const wisata = raw.map((kab, kabIdx) => {
  const logo = images[kabIdx % images.length]; // logo kabupaten

  let index = 0;
  const destinasi = kab.destinasi.map((d) => ({
    ...d,
    image: images[index++ % images.length],
    deskripsi: `Destinasi wisata populer di ${kab.kabupaten}.`,
  }));

  return {
    ...kab,
    logo,
    destinasi,
  };
});
