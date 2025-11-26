import { Router } from "express";

const router = Router();

// Ambil semua provinsi
router.get("/provinces", async (req, res) => {
  try {
    const response = await fetch("https://api-wliayah.vercel.app/region/provinces");

    if (!response.ok) throw new Error("Failed to fetch provinces");

    const data = await response.json();

    return res.status(data.status).json(data);

  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      status: 500,
      message: "Gagal mengambil data provinsi",
      data: []
    });
  }
});


// Ambil semua kabupaten dalam satu provinsi
router.get("/regencies/:provinsiId", async (req, res) => {
  const { provinsiId } = req.params;

  try {
    const response = await fetch(`https://api-wliayah.vercel.app/region/regencies/${provinsiId}`);
    if (!response.ok) throw new Error("Failed to fetch regencies");

    const data = await response.json();

    return res.status(data.status).json(data);

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Gagal mengambil data kabupaten",
      data: []
    });
  }
});


export default router;
