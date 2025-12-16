/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { apiFetch } from "@/helpers/api";
import { TestimoniItem, ApiResponse } from "@/types/testimoni";
export default function TestimoniSection() {
  const [testimonials, setTestimonials] = useState<TestimoniItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res: ApiResponse = await apiFetch("/api/testimoni");

        if (res?.data?.items) {
          // Optional: filter hanya yang APPROVED
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

  return (
    <section className="relative py-20 bg-linear-to-b from-[#ffffff] to-[#dbe7f9]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
          Testimoni
        </h2>

        {loading && (
          <p className="text-center text-gray-600">Memuat testimoni...</p>
        )}

        {!loading && testimonials.length === 0 && (
          <p className="text-center text-gray-500">Belum ada testimoni.</p>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
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

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/default-user.png"
                    alt="User"
                    className="w-10 h-10 object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-blue-600">
                    {item.name || "Anonymous"}
                  </h4>
                  <p className="text-gray-500 text-xs">
                    {item.profession || "Pengguna"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
