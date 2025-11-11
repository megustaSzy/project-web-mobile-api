"use client";
import { useState } from "react";
import { MapPin, Calendar, Clock, Users } from "lucide-react";

export default function SearchCard() {
  const [location, setLocation] = useState("Kota Bandar Lampung, Lampung");
  const [destination, setDestination] = useState("Kalianda");
  const [date, setDate] = useState("Rab, 5 Nov 2025");
  const [time, setTime] = useState("07.00 - 16.00");
  const [people, setPeople] = useState("4 Orang");

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-5xl mx-auto">
      {/* Bagian Atas (Lokasi Kamu + Cari Histori) */}
      <div className="flex items-center justify-between flex-wrap">
        <div>
          <p className="text-sm text-gray-400">Lokasi Kamu</p>
          <h2 className="text-lg font-semibold text-gray-800">{location}</h2>
        </div>
        <button className="text-sm text-gray-500 hover:text-blue-600 mt-2 md:mt-0">
          Cari Histori &gt;
        </button>
      </div>

      {/* Bar Pencarian */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Lokasi */}
        <div className="flex items-center gap-2 border rounded-full px-4 py-2 w-full md:w-auto">
          <MapPin className="text-gray-500 w-4 h-4" />
          <span className="text-gray-700 text-sm">{destination}</span>
        </div>

        {/* Tanggal */}
        <div className="flex items-center gap-2 border rounded-full px-4 py-2 w-full md:w-auto">
          <Calendar className="text-gray-500 w-4 h-4" />
          <span className="text-gray-700 text-sm">{date}</span>
        </div>

        {/* Waktu */}
        <div className="flex items-center gap-2 border rounded-full px-4 py-2 w-full md:w-auto">
          <Clock className="text-gray-500 w-4 h-4" />
          <span className="text-gray-700 text-sm">{time}</span>
        </div>

        {/* Jumlah Tiket */}
        <div className="flex items-center gap-2 border rounded-full px-4 py-2 w-full md:w-auto">
          <Users className="text-gray-500 w-4 h-4" />
          <span className="text-gray-700 text-sm">{people}</span>
        </div>

        {/* Tombol Search */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full transition-all">
          Search
        </button>
      </div>
    </div>
  );
}
