"use client";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

export default function TestimoniSection({ user }) {
  const testimonials = [
    {
      id: 1,
      text: "Liburanku jadi luar biasa berkat layanan yang cepat dan ramah. Terima kasih banyak!",
      rating: 5,
    },
    {
      id: 2,
      text: "Tempatnya indah banget dan pelayanannya memuaskan. Pasti balik lagi deh!",
      rating: 5,
    },
    {
      id: 3,
      text: "Sangat puas dengan pengalaman wisata yang ditawarkan, recommended banget!",
      rating: 5,
    },
    {
      id: 4,
      text: "Perjalanan yang menyenangkan dan tidak terlupakan, terima kasih LamiGo!",
      rating: 5,
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#Ffffff] to-[#dbe7f9]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
          Testimoni
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white/90 shadow-md rounded-2xl p-6 text-left border border-gray-100 hover:shadow-lg transition-all backdrop-blur-sm"
            >
              {/* Icon kutipan */}
              <Quote className="text-gray-300 mb-2" size={28} />

              {/* Isi testimoni */}
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                {item.text}
              </p>

              {/* Rating bintang */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="text-yellow-400 fill-yellow-400"
                    size={18}
                  />
                ))}
              </div>

              {/* Profil user */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={user?.image || "/images/default-user.png"}
                    alt={user?.name || "User"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-600">
                    {user?.name || "User"}
                  </h4>
                  <p className="text-gray-500 text-xs">
                    {user?.role || "Traveler"}
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
