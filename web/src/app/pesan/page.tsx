"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Calendar, Clock, Users, Phone, User } from "lucide-react";
import { useSearchParams } from "next/navigation";

const destinations = [
  {
    id: 1,
    name: "Rio The Beach",
    location: "Kalianda",
    image: "/images/hero1.jpg",
    desc: "Pantai Rio The Beach menghadirkan keindahan pasir putih dan ombak tenang, cocok untuk bersantai dan menikmati suasana laut.",
    price: 120000,
  },
  {
    id: 2,
    name: "Senaya Beach",
    location: "Kalianda",
    image: "/images/hero2.jpg",
    desc: "Senaya Beach menawarkan panorama laut biru dan angin sejuk, tempat ideal untuk bersantai dan menikmati keindahan alam.",
    price: 120000,
  },
  {
    id: 3,
    name: "Green Elty Krakatoa",
    location: "Kalianda",
    image: "/images/hero3.jpg",
    desc: "Green Elty Krakatoa menyajikan pemandangan laut yang menakjubkan dengan suasana tenang dan fasilitas nyaman untuk berlibur.",
    price: 120000,
  },
];

export default function PesanPage() {
  const searchParams = useSearchParams();
  const destId = Number(searchParams.get("id"));
  const selectedDest = destinations.find((d) => d.id === destId);

  // 🧭 Form state
  const [location, setLocation] = useState("Mendeteksi lokasi...");
  const [pickup, setPickup] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // 🛰️ Deteksi lokasi otomatis
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "Lokasi tidak diketahui";
            const state = data.address?.state || "";
            setLocation(`${city}, ${state}`);
          } catch {
            setLocation("Gagal mendeteksi lokasi");
          }
        },
        () => setLocation("Izin lokasi ditolak")
      );
    } else setLocation("Perangkat tidak mendukung geolokasi");
  }, []);

  // 🧾 Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Pesanan berhasil!\nNama: ${name}\nNo: ${phone}\nTujuan: ${
        selectedDest?.name || "-"
      }\nPenjemputan: ${pickup}\nTanggal: ${date}\nWaktu: ${time}\nJumlah Tiket: ${people}`
    );
  };

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-[#a7c8e7] to-[#ffffff] overflow-hidden py-20 px-6 flex flex-col items-center">
      {/* Background SVG */}
      <img
        src="/images/destinasi.svg"
        alt="Destinasi Background"
        className="absolute inset-0 w-full h-full object-cover opacity-2"
      />

      <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        {selectedDest ? (
          <>
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-40 h-40 rounded-xl overflow-hidden mb-4">
                <Image
                  src={selectedDest.image}
                  alt={selectedDest.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {selectedDest.name}
              </h1>
              <p className="text-sm text-gray-500 mb-2">
                {selectedDest.location}
              </p>
              <p className="text-gray-700 text-center text-sm">
                {selectedDest.desc}
              </p>
            </div>

            {/* FORM PEMESANAN */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div>
                <label className="text-sm text-gray-500">Nama</label>
                <div className="flex items-center gap-2 border rounded-full px-4 py-2">
                  <User className="text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="text-gray-700 text-sm bg-transparent outline-none w-full"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </div>

              {/* Nomor Telepon */}
              <div>
                <label className="text-sm text-gray-500">Nomor Telepon</label>
                <div className="flex items-center gap-2 border rounded-full px-4 py-2">
                  <Phone className="text-gray-500 w-4 h-4" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="text-gray-700 text-sm bg-transparent outline-none w-full"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

              {/* Lokasi Penjemputan */}
              <div>
                <label className="text-sm text-gray-500">
                  Lokasi Penjemputan
                </label>
                <div className="flex items-center gap-2 border rounded-full px-4 py-2">
                  <MapPin className="text-gray-500 w-4 h-4" />
                  <select
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    required
                    className="text-gray-700 text-sm bg-transparent outline-none w-full"
                  >
                    <option value="">Pilih Lokasi</option>
                    <option value="Terminal Rajabasa">Terminal Rajabasa</option>
                    <option value="Terminal Kemiling">Terminal Kemiling</option>
                    <option value="Stasiun Tanjung Karang">
                      Stasiun Tanjung Karang
                    </option>
                  </select>
                </div>
              </div>

              {/* Tanggal */}
              <div>
                <label className="text-sm text-gray-500">Tanggal</label>
                <div className="flex items-center gap-2 border rounded-full px-4 py-2">
                  <Calendar className="text-gray-500 w-4 h-4" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="text-gray-700 text-sm bg-transparent outline-none w-full"
                  />
                </div>
              </div>

              {/* Jam */}
              <div>
                <label className="text-sm text-gray-500">Jam</label>
                <div className="flex items-center gap-2 border rounded-full px-4 py-2">
                  <Clock className="text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    placeholder="07.00 - 16.00"
                    className="text-gray-700 text-sm bg-transparent outline-none w-full"
                  />
                </div>
              </div>

              {/* Jumlah Tiket */}
              <div>
                <label className="text-sm text-gray-500">Jumlah Tiket</label>
                <div className="flex items-center gap-2 border rounded-full px-4 py-2">
                  <Users className="text-gray-500 w-4 h-4" />
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={people}
                    onChange={(e) => setPeople(Number(e.target.value))}
                    required
                    className="text-gray-700 text-sm bg-transparent outline-none w-full"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full transition"
              >
                Konfirmasi Pesanan
              </button>
            </form>
          </>
        ) : (
          <div className="text-center text-gray-600">
            <p>Destinasi tidak ditemukan. Silakan pilih dari halaman utama.</p>
          </div>
        )}
      </div>
    </section>
  );
}
