import { Router } from "express";

const router = Router();

// Ambil semua provinsi
router.get("/provinces", async (req, res) => {
  try {
    const response = await fetch("https://api-wliayah.vercel.app/region/provinces");

    if (!response.ok) throw new Error("Failed to fetch provinces");

    const data = await response.json();

    res.json({ 
        success: true, 
        data 
    });

  } catch (error: any) {

    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil data provinsi" });
  }
});

// Ambil semua kabupaten dalam satu provinsi
router.get("/regencies/:provinsiId", async (req, res) => {

  const { provinsiId } = req.params;

  try {
    const response = await fetch(`https://api-wliayah.vercel.app/region/regencies/${provinsiId}`);
    if (!response.ok) throw new Error("Failed to fetch regencies");

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil data kabupaten" });
  }
});

// Ambil data kabupaten spesifik berdasarkan kabupatenId
router.get("/regency/:kabupatenId", async (req, res) => {
  const { kabupatenId } = req.params;

  try {
    const response = await fetch(`https://api-wliayah.vercel.app/region/regency/${kabupatenId}`);
    if (!response.ok) throw new Error("Failed to fetch regency");

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil data kabupaten" });
  }
});


export default router;
