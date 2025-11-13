"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Calendar, Clock, Users, Phone, User, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

  const [pickup, setPickup] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);

  // 🎯 Handler Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000); // auto-close popup
  };

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 flex items-center justify-center py-20 px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/images/destinasi.svg')] bg-cover bg-center opacity-10" />

      <div className="relative z-10 w-full max-w-xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg rounded-3xl p-8 md:p-10">
        {selectedDest ? (
          <>
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-md mb-4">
                <Image
                  src={selectedDest.image}
                  alt={selectedDest.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">
                {selectedDest.name}
              </h1>
              <p className="text-sm text-gray-500">{selectedDest.location}</p>
              <p className="text-gray-600 text-sm mt-3 max-w-md leading-relaxed">
                {selectedDest.desc}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                {
                  label: "Nama Lengkap",
                  icon: <User className="w-4 h-4 text-gray-400" />,
                  type: "text",
                  value: name,
                  setter: setName,
                  placeholder: "Masukkan nama lengkap",
                },
                {
                  label: "Nomor Telepon",
                  icon: <Phone className="w-4 h-4 text-gray-400" />,
                  type: "tel",
                  value: phone,
                  setter: setPhone,
                  placeholder: "08xxxxxxxxxx",
                },
              ].map((field, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    {field.label}
                  </label>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-300 transition-all">
                    {field.icon}
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      required
                      className="w-full bg-transparent outline-none text-gray-700 text-sm"
                    />
                  </div>
                </div>
              ))}

              {/* Lokasi Penjemputan */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Lokasi Penjemputan
                </label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-300">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <select
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    required
                    className="w-full bg-transparent outline-none text-gray-700 text-sm"
                  >
                    <option value="">Pilih lokasi</option>
                    <option value="Terminal Rajabasa">Terminal Rajabasa</option>
                    <option value="Terminal Kemiling">Terminal Kemiling</option>
                    <option value="Stasiun Tanjung Karang">Stasiun Tanjung Karang</option>
                  </select>
                </div>
              </div>

              {/* Grid Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Tanggal</label>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-gray-700 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Jam</label>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-300">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="07.00 - 16.00"
                      required
                      className="w-full bg-transparent outline-none text-gray-700 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Jumlah Tiket */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Jumlah Tiket</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-300">
                  <Users className="w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={people}
                    onChange={(e) => setPeople(Number(e.target.value))}
                    required
                    className="w-full bg-transparent outline-none text-gray-700 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200"
              >
                Konfirmasi Pesanan
              </button>
            </form>
          </>
        ) : (
          <div className="text-center text-gray-600 py-10">
            <p className="text-lg font-medium">🚫 Destinasi tidak ditemukan</p>
            <p className="text-sm text-gray-500 mt-2">
              Silakan kembali ke halaman utama untuk memilih destinasi.
            </p>
          </div>
        )}
      </div>

      {/* ✅ Popup Sukses */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm w-full"
            >
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-gray-800">Pesanan Berhasil!</h2>
              <p className="text-sm text-gray-600 mt-1">
                Terima kasih {name || "Pengguna"}, pesananmu telah dikonfirmasi 🎉
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
