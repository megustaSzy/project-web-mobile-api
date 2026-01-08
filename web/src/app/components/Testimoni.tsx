"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { apiFetch } from "@/helpers/api";
import { TestimoniItem, ApiResponse } from "@/types/testimoni";

export default function TestimoniSection() {
  const [testimonials, setTestimonials] = useState<TestimoniItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // jumlah testimoni per halaman

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res: ApiResponse = await apiFetch("/api/testimoni");

        if (res?.data?.items) {
          const approved = res.data.items.filter(
            (item) => item.approvalStatus === "APPROVED"
          );
          setTestimonials(approved);
        }
      } catch (err) {
        console.error("Gagal mengambil testimoni:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  // Hitung data yang akan ditampilkan di halaman sekarang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = testimonials.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  return (
    <section className="relative py-20 bg-linear-to-b from-[#ffffff] to-[#dbe7f9]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
          Testimoni
        </h2>

        {loading && <p className="text-center text-gray-600">Memuat testimoni...</p>}

        {!loading && testimonials.length === 0 && (
          <p className="text-center text-gray-500">Belum ada testimoni.</p>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/90 shadow-md rounded-2xl p-6 text-left border border-gray-100 hover:shadow-lg transition-all backdrop-blur-sm"
            >
              <Quote className="text-gray-300 mb-2" size={28} />

              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                {item.comment}
              </p>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="text-yellow-400 fill-yellow-400"
                    size={18}
                  />
                ))}
              </div>

              <div className="flex flex-col items-start gap-1">
                <h4 className="font-semibold text-blue-600">
                  {item.name || "Anonymous"}
                </h4>
                <p className="text-gray-500 text-xs">
                  {item.profession || "Pengguna"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
