"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Calendar, Clock, Users } from "lucide-react";

export default function SearchCard() {
  const [location, setLocation] = useState("Mendeteksi lokasi...");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [displayDate, setDisplayDate] = useState("Pilih tanggal");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(1);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  // 🔹 Deteksi lokasi otomatis
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
    } else {
      setLocation("Perangkat tidak mendukung geolokasi");
    }
  }, []);

  // 🔹 Format tanggal gaya Indonesia
  const formatDate = (value: string) => {
    if (!value) return "Pilih tanggal";
    const dateObj = new Date(value);
    const formatted = dateObj.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return formatted.replaceAll(".", "");
  };

  // 🔹 Klik area kalender
  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker?.(); // Buka date picker
    }
  };

  // 🔹 Saat pilih tanggal
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);
    setDisplayDate(formatDate(value));
  };

  // 🔹 Tombol Search
  const handleSearch = () => {
    alert(
      `Mencari tiket ke ${destination || "?"} pada ${displayDate} (${time ||
        "-"}) untuk ${people} orang.`
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-5xl mx-auto border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <p className="text-sm text-gray-400">Lokasi Kamu</p>
          <h2 className="text-lg font-semibold text-gray-800">{location}</h2>
        </div>
        <button className="text-sm text-gray-500 hover:text-blue-600 transition">
          Cari Histori &gt;
        </button>
      </div>

      {/* Isi Form */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Lokasi Tujuan */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-xs text-gray-400 mb-1">Lokasi Penjemputan</label>
          <div className="flex items-center gap-2 border rounded-full px-4 py-2">
            <MapPin className="text-gray-500 w-4 h-4" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="text-gray-700 text-sm bg-transparent outline-none w-full"
            >
              <option value="">Pilih Tujuan</option>
              <option value="Terminal Rajabasa">Terminal Rajabasa</option>
              <option value="Terminal Kemiling">Terminal Kemiling</option>
              <option value="Stasiun Tanjung Karang">Stasiun Tanjung Karang</option>
            </select>
          </div>
        </div>

        {/* Tujuan Wisata */}
<div className="flex flex-col w-full md:w-auto">
  <label className="text-xs text-gray-400 mb-1">Tujuan Wisata</label>
  <div className="flex items-center gap-2 border rounded-full px-4 py-2">
    <MapPin className="text-gray-500 w-4 h-4" />
    <select
      value={destination}
      onChange={(e) => setDestination(e.target.value)}
      className="text-gray-700 text-sm bg-transparent outline-none w-full"
    >
      <option value="">Pilih Tujuan Wisata</option>

      {/* Pantai */}
      <optgroup label="Pantai">
        <option value="Pantai Mutun">Pantai Mutun</option>
        <option value="Pantai Sari Ringgung">Pantai Sari Ringgung</option>
        <option value="Pantai Kelagian">Pantai Kelagian</option>
        <option value="Pantai Tanjung Setia">Pantai Tanjung Setia</option>
        <option value="Pantai Klara">Pantai Klara</option>
        <option value="Pantai Marina">Pantai Marina</option>
        <option value="Pantai Sebalang">Pantai Sebalang</option>
      </optgroup>

      {/* Pulau */}
      <optgroup label="Pulau">
        <option value="Pulau Pahawang">Pulau Pahawang</option>
        <option value="Pulau Tegal Mas">Pulau Tegal Mas</option>
        <option value="Pulau Kelagian Lunik">Pulau Kelagian Lunik</option>
        <option value="Pulau Mahitam">Pulau Mahitam</option>
        <option value="Pulau Balak">Pulau Balak</option>
      </optgroup>

      {/* Gunung */}
      <optgroup label="Gunung">
        <option value="Gunung Rajabasa">Gunung Rajabasa</option>
        <option value="Gunung Pesawaran">Gunung Pesawaran</option>
        <option value="Gunung Seminung">Gunung Seminung</option>
      </optgroup>

      {/* Bukit */}
      <optgroup label="Bukit">
        <option value="Bukit Pangonan">Bukit Pangonan</option>
        <option value="Bukit Sakura">Bukit Sakura</option>
        <option value="Bukit Aslan">Bukit Aslan</option>
        <option value="Bukit Kumbang">Bukit Kumbang</option>
      </optgroup>

      {/* Air Terjun */}
      <optgroup label="Air Terjun">
        <option value="Air Terjun Putri Malu">Air Terjun Putri Malu</option>
        <option value="Air Terjun Curup Gangsa">Air Terjun Curup Gangsa</option>
        <option value="Air Terjun Lembah Pelangi">Air Terjun Lembah Pelangi</option>
        <option value="Air Terjun Ciupang">Air Terjun Ciupang</option>
        <option value="Air Terjun Way Lalaan">Air Terjun Way Lalaan</option>
      </optgroup>
    </select>
  </div>
</div>


        {/* 🔹 Input tanggal bergaya bubble */}
        <div className="flex flex-col w-full md:w-auto relative">
          <label className="text-xs text-gray-400 mb-1">Tanggal</label>
          <div
            onClick={handleCalendarClick}
            className="flex items-center gap-2 border rounded-full px-4 py-2  transition relative"
          >
            <Calendar className="text-gray-500 w-3 h-3" />
            <span className="text-gray-700 text-sm select-none">{displayDate}</span>

            {/* Input date tersembunyi tapi tetap bisa klik di posisi yang benar */}
            <input
              ref={dateInputRef}
              type="date"
              value={date}
              onChange={handleDateChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Waktu */}
<div className="flex flex-col w-full md:w-auto">
  <label className="text-xs text-gray-400 mb-1">Waktu</label>
  <div className="flex items-center gap-2 border rounded-full px-4 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-300 transition">
    <Clock className="text-gray-500 w-4 h-4" />

    <input
      type="time"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      min="07:00"
      max="16:00"
      className="text-gray-700 text-sm bg-transparent outline-none w-full"
      required
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
              max="16"
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
