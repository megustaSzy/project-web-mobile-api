import Image from "next/image";

export default function SejarahSection() {
  return (
    <div
      className="w-full mt-20 px-6 py-20 rounded-3xl"
      style={{
        backgroundImage: "url('/images/16.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

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

        {/* SVG Mobil */}
        <div className="flex justify-center md:justify-end">
          <Image
            src="/images/mobil.svg"
            alt="Mobil"
            width={350}
            height={350}
            className="object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
