"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Users } from "lucide-react";

export default function SearchCard() {
  const [location, setLocation] = useState("Mendeteksi lokasi...");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(1);

  // 🔹 Deteksi lokasi otomatis pakai Geolocation API
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
          } catch (err) {
            console.error("Gagal ambil lokasi:", err);
            setLocation("Gagal mendeteksi lokasi");
          }
        },
        (err) => {
          console.error("Izin lokasi ditolak:", err);
          setLocation("Izin lokasi ditolak");
        }
      );
    } else {
      setLocation("Perangkat tidak mendukung geolokasi");
    }
  }, []);

  // 🔹 Fungsi tombol Search
  const handleSearch = () => {
    console.log({
      lokasi: location,
      tujuan: destination,
      tanggal: date,
      waktu: time,
      orang: people,
    });
    alert(
      `Mencari tiket ke ${destination || "?"} pada ${date || "-"} (${time ||
        "-"}) untuk ${people} orang.`
    );
  };

  // 🔹 Fungsi tombol Histori
  const handleHistory = () => {
    alert("Fitur histori pencarian belum dihubungkan ke backend.");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-5xl mx-auto border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <p className="text-sm text-gray-400">Lokasi Kamu</p>
          <h2 className="text-lg font-semibold text-gray-800">{location}</h2>
        </div>
        <button
          onClick={handleHistory}
          className="text-sm text-gray-500 hover:text-blue-600 transition"
        >
          Cari Histori &gt;
        </button>
      </div>

      {/* Isi Form */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Lokasi Tujuan */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-xs text-gray-400 mb-1">Lokasi</label>
          <div className="flex items-center gap-2 border rounded-full px-4 py-2">
            <MapPin className="text-gray-500 w-4 h-4" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="text-gray-700 text-sm bg-transparent outline-none w-full"
            >
              <option value="">Pilih Tujuan</option>
              <option value="Kalianda">Kalianda</option>
              <option value="Metro">Metro</option>
              <option value="Pringsewu">Pringsewu</option>
              <option value="Liwa">Liwa</option>
              <option value="Krui">Krui</option>
              <option value="Kotabumi">Kotabumi</option>
            </select>
          </div>
        </div>

        {/* Tanggal */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-xs text-gray-400 mb-1">Tanggal</label>
          <div className="flex items-center gap-2 border rounded-full px-4 py-2">
            <Calendar className="text-gray-500 w-4 h-4" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-gray-700 text-sm bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Waktu */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-xs text-gray-400 mb-1">Waktu</label>
          <div className="flex items-center gap-2 border rounded-full px-4 py-2">
            <Clock className="text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="07.00 - 16.00"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-gray-700 text-sm bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Jumlah Tiket */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-xs text-gray-400 mb-1">Jumlah Tiket</label>
          <div className="flex items-center gap-2 border rounded-full px-4 py-2">
            <Users className="text-gray-500 w-4 h-4" />
            <input
              type="number"
              min="1"
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="text-gray-700 text-sm bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Tombol Search */}
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full mt-5 md:mt-6 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
}
