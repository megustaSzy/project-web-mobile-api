"use client";

import { QRCodeSVG } from "qrcode.react";

export default function DetailTiket({ params }: { params: { id: string } }) {
  const tiketId = params.id;

  const tiket = {
    id: tiketId,
    destinasi: "Pantai Sari Ringgung",
    nama: "Muhammad Arif Alfa'iz",
    tanggal: "2025-11-20",
    jumlah: 2,
    code: `TIK-${tiketId}ABC123`, // contoh kode tiket
    status: "Sudah Dibayar",
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Detail Tiket</h1>

      <div className="bg-white p-6 rounded-xl shadow border">
        {/* KODE TIKET */}
        <p className="text-sm text-gray-600">Kode Tiket</p>
        <h2 className="text-lg font-bold">{tiket.code}</h2>

        {/* INFORMASI */}
        <div className="mt-4 space-y-1">
          <p>Destinasi: {tiket.destinasi}</p>
          <p>Nama Pemesan: {tiket.nama}</p>
          <p>Tanggal Kunjungan: {tiket.tanggal}</p>
          <p>Jumlah Tiket: {tiket.jumlah}</p>

          <span
            className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
              tiket.status === "Sudah Dibayar"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {tiket.status}
          </span>
        </div>

        {/* QR CODE */}
        <div className="flex justify-center mt-6">
          <QRCodeSVG value={tiket.code} size={200} />
        </div>

        <p className="text-center text-sm mt-3 text-gray-500">
          Tunjukkan QR Code ini di loket untuk masuk
        </p>
      </div>
    </div>
  );
}
