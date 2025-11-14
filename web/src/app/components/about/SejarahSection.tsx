"use client";
import Image from "next/image";

export default function CeritaPage() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden pb-32">
      {/* Background gradasi */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300"></div>

      {/* Tekstur garis samar */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/tekturgaris.svg"
          alt="Tekstur garis"
          fill
          className="object-cover"
        />
      </div>

      {/* Judul & deskripsi di tengah atas */}
      <div className="relative z-10 text-center mb-10 px-6 pt-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Ceritakan Momen Serumumu
        </h2>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          Bagikan pengalaman bahagiamu bersama{" "}
          <span className="font-semibold text-blue-600">LamiGo</span> dan bantu
          wisatawan lain menemukan perjalanan terbaik.
        </p>
      </div>

      {/* Konten utama (form kiri & gambar kanan) */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full px-6 md:px-20 space-y-8 md:space-y-0 md:space-x-10">
        {/* Text */}
        <div>
          <h2 className="text-3xl font-bold mb-4">Sejarah LamiGo</h2>
          <p className="text-gray-700 leading-relaxed">
            Lamigo lahir dari semangat untuk menghadirkan pengalaman berwisata 
            yang lebih terarah, bermakna, dan berkelanjutan. Kami percaya bahwa 
            setiap perjalanan bukan sekadar tentang tempat yang dikunjungi, tetapi 
            tentang cerita yang dibawa pulang. Melalui inovasi digital, Lamigo 
            berupaya menghubungkan keindahan alam Lampung dengan generasi muda 
            yang mencintai eksplorasi dan peduli terhadap lingkungan.
          </p>
        </div>
        {/* Kanan: Gambar orang */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          <Image
            src="/images/16.svg"
            alt="Traveler"
            width={700}
            height={700}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
