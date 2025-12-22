/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin } from "lucide-react";
import { apiFetch } from "@/helpers/api";
import { ApiDestinationItem, ApiDestinationsResponse } from "@/types/destination";
import DestinationModal from "../components/DestinationModal";
import { DestinationsType } from "@/types/destination"; // pastikan tipe ini sesuai modal

type Props = {
  setSelectedData?: (data: ApiDestinationItem) => void;
  setOpenModal?: (open: boolean) => void;
};

export default function SearchPage({ setSelectedData, setOpenModal }: Props) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const area = searchParams.get("area");

  const [data, setData] = useState<ApiDestinationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDataInternal, setSelectedDataInternal] = useState<DestinationsType | null>(null);

  // const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Mapping ApiDestinationItem -> DestinationsType
  const mapToDestinationsType = (item: ApiDestinationItem): DestinationsType => ({
    id: item.id,
    name: item.name ?? "Tanpa Nama",
    imageUrl: item.imageUrl,
    description: item.description ?? "Deskripsi belum tersedia",
    price: item.price ?? 0,
    include: item.include ?? [],
    ketentuan: item.ketentuan ?? [],
    perhatian: item.perhatian ?? [],
    category: item.category!,
    region: item.region!,
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (category) params.append("categoryId", category);
        if (area) params.append("regionId", area);

        const res = await apiFetch<ApiDestinationsResponse>(
          `/api/destinations?${params.toString()}`
        );

        if (res?.status === 200 && res.data?.items) {
          let items = res.data.items;

          if (category) {
            const categoryNum = Number(category);
            items = items.filter((item) => item.category?.id === categoryNum);
          }
          if (area) {
            const areaNum = Number(area);
            items = items.filter(
              (item) => item.region?.id !== null && item.region?.id === areaNum
            );
          }

          setData(items);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data destinasi");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [category, area]);

  const handleDetailClick = (item: ApiDestinationItem) => {
    const mapped = mapToDestinationsType(item);
    setSelectedDataInternal(mapped);
    setModalOpen(true);

    if (setSelectedData) setSelectedData(item);
    if (setOpenModal) setOpenModal(true);
  };

  if (loading) return <p className="p-10 text-gray-500 text-center">Memuat data...</p>;
  if (error) return <p className="p-10 text-red-500 text-center">{error}</p>;
  if (!data.length) return <p className="p-10 text-gray-500 text-center">Tidak ada destinasi ditemukan</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">Hasil Pencarian Destinasi</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={item.imageUrl ? `${item.imageUrl}` : "/images/default.jpg"}
                alt={item.name || "Destinasi"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white text-xl font-semibold line-clamp-2">
                  {item.name || "Nama tidak tersedia"}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-200 mt-1">
                  <MapPin className="w-4 h-4" />
                  {item.region?.name || "Region tidak tersedia"}
                </div>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center">
              <span className="inline-block text-xs font-medium bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                {item.category?.name || "Kategori tidak tersedia"}
              </span>
              <span
                onClick={() => handleDetailClick(item)}
                className="text-blue-600 text-sm cursor-pointer font-medium hover:underline"
              >
                Lihat Detail →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <DestinationModal
        open={modalOpen}
        data={selectedDataInternal} // ✅ perbaikan
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
