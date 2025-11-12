"use client";

export default function ChooseUs() {
  return (
    <section
      className="
        relative 
        bg-gray-100
        bg-[url('/images/peta.svg')]
        bg-gradient-to-b from-[#f8fafc] to-white 
        py-20 overflow-hidden
        bg-no-repeat bg-center bg-cover
      "
    >
      {/* Overlay transparan — di bawah konten */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f2f6f9] to-[#ffffff]/90 z-0"></div>

      {/* Ornamen titik-titik latar belakang */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20 z-0">
        <div className="w-[90%] h-[90%] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_1px,_transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Konten utama */}
      <div className="relative z-10">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Mengapa <span className="text-blue-600">Memilih</span> Kami
        </h2>
        <p className="text-center text-sm text-gray-500 mb-10">
          Layanan profesional, harga bersahabat, dan perjalanan penuh kenangan
          bersama <span className="font-semibold text-blue-500">LamiGo</span>
        </p>

        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Gambar kiri */}
          <div className="flex justify-center">
            <img
              src="/images/5.png"
              alt="Liburan"
              className="max-w-md w-full h-auto drop-shadow-xl"
            />
          </div>

          {/* List Kelebihan */}
          <div className="space-y-4">
            {[
              {
                img: "/images/1.png",
                value: "100+",
                desc: "Perjalanan — Beri rating perjalananmu dan bantu wisatawan lain",
              },
              {
                img: "/images/2.png",
                value: "99+",
                desc: "Pengalaman — Bagikan pengalamanmu dan bantu wisatawan lain",
              },
              {
                img: "/images/3.png",
                value: "100+",
                desc: "Bahagia — Sebarkan momen bahagiamu bersama wisatawan",
              },
              {
                img: "/images/4.png",
                value: "89%",
                desc: "Rating — Tunjukkan rating bahagiamu dari pengalaman seru",
              },
            ].map((item, i) => {
              // Pisahkan title dan deskripsi dengan "—"
              const [title, description] = item.desc.split("—");

              return (
                <div
                  key={i}
                  className="flex items-center bg-white rounded-2xl shadow-sm p-4 border border-gray-100"
                >
                  <img
                    src={item.img}
                    alt={title.trim()}
                    className="w-12 h-12 mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.value}
                    </h3>
                    <p className="text-gray-800 text-sm leading-tight">
                      <span className="font-semibold block">
                        {title.trim()}
                      </span>
                      <span>{description.trim()}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
