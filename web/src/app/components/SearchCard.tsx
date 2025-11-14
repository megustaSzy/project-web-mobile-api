"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Calendar, Clock, Users } from "lucide-react";

export default function SearchCard() {
  const [location, setLocation] = useState("Mendeteksi lokasi...");
  const [date, setDate] = useState("");
  const [displayDate, setDisplayDate] = useState("Pilih tanggal");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(1);

  const [pickupLocation, setPickupLocation] = useState("");
  const [tourDestination, setTourDestination] = useState("");

  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const timeInputRef = useRef<HTMLInputElement | null>(null);

  const displayTime = time || "--:--";

  /* =====================================================================================
     FIX ESLINT ERROR: setState tidak boleh dipanggil sync dalam effect
     Solusi → gunakan setTimeout agar dianggap async
  ====================================================================================== */
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

            setTimeout(() => {
              setLocation(`${city}, ${state}`);
            }, 0);
          } catch {
            setTimeout(() => {
              setLocation("Gagal mendeteksi lokasi");
            }, 0);
          }
        },

        () => {
          setTimeout(() => {
            setLocation("Izin lokasi ditolak");
          }, 0);
        }
      );
    } else {
      setTimeout(() => {
        setLocation("Perangkat tidak mendukung geolokasi");
      }, 0);
    }
  }, []);

  // Format tanggal Indonesia
  const formatDate = (value: string) => {
    if (!value) return "Pilih tanggal";
    const dt = new Date(value);
    return dt
      .toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replaceAll(".", "");
  };

  // Klik area tanggal
  const handleCalendarClick = () => {
    dateInputRef.current?.showPicker?.();
  };

  // Saat memilih tanggal
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);
    setDisplayDate(formatDate(value));
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

      {/* Form */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
        {/* Penjemputan */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-gray-400 mb-1">Lokasi Penjemputan</label>
          <div className="flex items-center gap-2 border rounded-full px-4 py-2 bg-white w-full">
            <MapPin className="text-gray-500 w-4 h-4" />

            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="text-gray-700 text-sm bg-transparent outline-none w-full"
            >
              <option value="">Pilih Penjemputan</option>
              <option value="Terminal Rajabasa">Terminal Rajabasa</option>
              <option value="Terminal Kemiling">Terminal Kemiling</option>
              <option value="Stasiun Tanjung Karang">Stasiun Tanjung Karang</option>
            </select>
          </div>
        </div>

        {/* Tujuan Wisata */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-gray-400 mb-1">Tujuan Wisata</label>
          <div className="flex items-center gap-2 border rounded-full px-4 py-2 bg-white w-full">
            <MapPin className="text-gray-500 w-4 h-4" />

            <select
              value={tourDestination}
              onChange={(e) => setTourDestination(e.target.value)}
              className="text-gray-700 text-sm bg-transparent outline-none w-full"
            >
              <option value="">Pilih Tujuan</option>

              <optgroup label="Pantai">
                <option value="Pantai Mutun">Pantai Mutun</option>
                <option value="Pantai Sari Ringgung">Pantai Sari Ringgung</option>
                <option value="Pantai Kelagian">Pantai Kelagian</option>
                <option value="Pantai Tanjung Setia">Pantai Tanjung Setia</option>
                <option value="Pantai Klara">Pantai Klara</option>
                <option value="Pantai Marina">Pantai Marina</option>
                <option value="Pantai Sebalang">Pantai Sebalang</option>
              </optgroup>

              <optgroup label="Pulau">
                <option value="Pulau Pahawang">Pulau Pahawang</option>
                <option value="Pulau Tegal Mas">Pulau Tegal Mas</option>
                <option value="Pulau Kelagian Lunik">Pulau Kelagian Lunik</option>
                <option value="Pulau Mahitam">Pulau Mahitam</option>
                <option value="Pulau Balak">Pulau Balak</option>
              </optgroup>

              <optgroup label="Gunung">
                <option value="Gunung Rajabasa">Gunung Rajabasa</option>
                <option value="Gunung Pesawaran">Gunung Pesawaran</option>
                <option value="Gunung Seminung">Gunung Seminung</option>
              </optgroup>

              <optgroup label="Bukit">
                <option value="Bukit Pangonan">Bukit Pangonan</option>
                <option value="Bukit Sakura">Bukit Sakura</option>
                <option value="Bukit Aslan">Bukit Aslan</option>
                <option value="Bukit Kumbang">Bukit Kumbang</option>
              </optgroup>

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

        {/* Tanggal */}
        <div className="flex flex-col w-full relative">
          <label className="text-xs text-gray-400 mb-1">Tanggal</label>

          <div
            onClick={handleCalendarClick}
            className="flex items-center gap-2 border rounded-full px-4 py-2 bg-white w-full relative cursor-pointer"
          >
            <Calendar className="text-gray-500 w-4 h-4" />
            <span className="text-gray-700 text-sm select-none">{displayDate}</span>

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
        <div className="flex flex-col w-full relative">
          <label className="text-xs text-gray-400 mb-1">Waktu</label>

          <div
            onClick={() => timeInputRef.current?.showPicker?.()}
            className="flex items-center gap-2 border rounded-full px-4 py-2 bg-white w-full relative cursor-pointer"
          >
            <Clock className="text-gray-500 w-4 h-4" />

            <span className="text-gray-700 text-sm select-none flex-1 text-left">
              {displayTime}
            </span>

            <input
              ref={timeInputRef}
              type="time"
              value={time}
              min="07:00"
              max="16:00"
              onChange={(e) => setTime(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Tiket */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-gray-400 mb-1">Jumlah Tiket</label>

          <div className="flex items-center gap-2 border rounded-full px-4 py-2 bg-white w-full">
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
      </div>
    </div>
  );
}
