import React from "react";

export default function VisiMisiSection() {
  return (
    <section className="w-full py-20 bg-[linear-gradient(to_bottom,#bfd8f7,#ffffff,#bfd8f7)]">

      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Visi */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-6">Visi</h2>
          <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 border border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              Menjadi platform wisata digital yang berperan aktif dalam membangun ekosistem
              pariwisata Lampung yang maju, inklusif, dan berkelanjutan.
            </p>
          </div>
        </div>

        {/* Misi */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-6">Misi</h2>
          <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 border border-gray-100 space-y-2">
            <p className="text-gray-700 leading-relaxed">
              Mengembangkan teknologi yang memudahkan wisatawan menemukan dan menjelajahi
              destinasi di Lampung.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Mendorong kolaborasi antara wisatawan, pelaku lokal, dan pemerintah daerah.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Menyediakan layanan wisata yang aman, informatif, dan berorientasi pada kepuasan
              pengguna.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Menumbuhkan kesadaran akan pentingnya pelestarian alam dan budaya lokal.
            </p>
          </div>
        </div>

        {/* Nilai Utama */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Nilai Utama LamiGo</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inovatif */}
          <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 flex items-start gap-4">
            <img src="/images/14.svg" alt="Inovatif" className="w-20 h-20" />
            <div>
              <h3 className="font-semibold text-lg">Inovatif</h3>
              <p className="text-gray-600 text-sm">
                Selalu berinovasi untuk menciptakan pengalaman wisata yang relevan dengan perkembangan zaman.
              </p>
            </div>
          </div>

          {/* Tanggung Jawab */}
          <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 flex items-start gap-4">
            <img src="/images/15.svg" alt="Tanggung Jawab" className="w-20 h-20" />
            <div>
              <h3 className="font-semibold text-lg">Tanggung Jawab</h3>
              <p className="text-gray-600 text-sm">
                Berkomitmen menjaga kepercayaan pengguna dan mendukung pariwisata berkelanjutan.
              </p>
            </div>
          </div>

          {/* Kolaboratif */}
          <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 flex items-start gap-4">
            <img src="/images/17.svg" alt="Kolaboratif" className="w-20 h-20" />
            <div>
              <h3 className="font-semibold text-lg">Kolaboratif</h3>
              <p className="text-gray-600 text-sm">
                Membangun kerja sama dengan berbagai pihak demi kemajuan wisata daerah.
              </p>
            </div>
          </div>

          {/* Cepat */}
          <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 flex items-start gap-4">
            <img src="/images/18.svg" alt="Cepat" className="w-20 h-20" />
            <div>
              <h3 className="font-semibold text-lg">Cepat</h3>
              <p className="text-gray-600 text-sm">
                Memberikan layanan yang responsif dan efisien untuk setiap kebutuhan wisatawan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
