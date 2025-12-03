"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import { HistoryType } from "@/types/history";

// type SejarahType = {
//   title: string;
//   content: string;
// };

export default function SejarahSection() {
  const [data, setData] = useState<HistoryType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setErrorMsg] = useState<string | null>(null);

  console.log("Data:", data);

  async function getData(): Promise<void> {
    setLoading(true);
    setErrorMsg(null);

    try {
      const endpoint = "/about";
      console.log(" Memanggil:", endpoint);

      const result = await apiFetch<HistoryType>(endpoint);
      // console.log("🚀 Hasil:", );
      // Validasi hasil tanpa any
      if (result) {
        setData(result);
        setLoading(false);
      } else {
        throw new Error("Format data API tidak sesuai.");
      }
    } catch (error) {
      const err = error instanceof Error ? error.message : "Terjadi kesalahan";
      setErrorMsg(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden py-20">
      {/* Background gradasi */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-100 via-blue-200 to-blue-300"></div>

      {/* Tekstur garis samar */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/tekturgaris.svg"
          alt="Tekstur garis"
          fill
          className="object-cover"
        />
      </div>

      {/* Konten utama */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full px-6 md:px-20 gap-10">
        {/* Kiri: Teks */}
        <div className="md:w-1/2 max-w-lg">
          {/* <p className="text-gray-700">{data?.data.history}</p> */}
          {loading && (
            <>
              <h2 className="text-3xl font-bold mb-4">Loading...</h2>
              <p className="text-gray-700">Sedang mengambil data sejarah...</p>
            </>
          )}

          {!loading && (
            <>
              <h2 className="text-3xl font-bold mb-4">Sejarah</h2>
              <p className="text-gray-700">{data?.data.history}</p>
            </>
          )}
        </div>

        {/* Kanan: Gambar */}
        <div className="md:w-1/2 flex justify-center">
          <div className="w-full max-w-[450px]">
            <Image
              src="/images/16.svg"
              alt="Traveler"
              width={700}
              height={700}
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
