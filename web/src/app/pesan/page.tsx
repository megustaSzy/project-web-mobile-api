"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MapPin, Calendar, Clock, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/helpers/api";
import { DestinationsType } from "@/types/destination";

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export default function PesanPage() {
  const searchParams = useSearchParams();
  const destinationId = Number(searchParams.get("destinationId"));

  const [destination, setDestination] = useState<DestinationsType | null>(null);
  const [loading, setLoading] = useState(true);

  const [pickup, setPickup] = useState("");
  const [date, setDate] = useState("");
  const [departTime, setDepartTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [people, setPeople] = useState(1);

  const dateRef = useRef<HTMLInputElement>(null);
  const departRef = useRef<HTMLInputElement>(null);
  const returnRef = useRef<HTMLInputElement>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!destinationId) return;

    const fetchData = async () => {
      try {
        const res: ApiResponse<DestinationsType> = await apiFetch(
          `/api/destinations/${destinationId}`
        );
        setDestination(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [destinationId]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!destination)
    return <p className="text-center mt-20">Destinasi tidak ditemukan</p>;

  const imageUrl = destination.imageUrl
    ? `${process.env.NEXT_PUBLIC_API_URL}${destination.imageUrl}`
    : "/images/default.jpg";

  const totalPrice = destination.price * people;

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    await apiFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        destinationId: destination.id,
        pickup,
        date,
        departTime,
        returnTime,
        people,
      }),
    });

    alert("Pesanan berhasil 🎉");
  };

  return (
    <main className="min-h-screen bg-neutral-100 flex justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow overflow-hidden">
        {/* IMAGE */}
        <div className="relative h-36">
          <Image
            src={imageUrl}
            alt={destination.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="p-5 space-y-4">
          {/* TITLE */}
          <div>
            <h1 className="text-base font-semibold">{destination.name}</h1>
            <p className="flex items-center gap-1 text-xs text-neutral-500">
              <MapPin size={12} />
              {destination.category.name}
            </p>
          </div>

          {/* INFO */}
          <div className="flex justify-between bg-blue-600 text-white text-xs rounded-full px-4 py-2">
            <span>Max 16 User</span>
            <span>12 Hours Duration</span>
          </div>

          {/* FORM */}
          <div className="space-y-3 text-sm">
            <Label>Pilih lokasi penjemputan</Label>
            <Field icon={<MapPin size={16} />}>
              <select
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
              >
                <option value="">Lokasi Penjemputan</option>
                <option value="Terminal Rajabasa">Terminal Rajabasa</option>
                <option value="Stasiun Tanjung Karang">
                  Stasiun Tanjung Karang
                </option>
              </select>
            </Field>

            <Label>Pilih tanggal</Label>
            <Field
              icon={<Calendar size={16} />}
              onIconClick={() => dateRef.current?.showPicker()}
            >
              <input
                ref={dateRef}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent outline-none text-sm
                  [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
            </Field>

            <Label>Pilih waktu keberangkatan</Label>
            <Field
              icon={<Clock size={16} />}
              onIconClick={() => departRef.current?.showPicker()}
            >
              <input
                ref={departRef}
                type="time"
                value={departTime}
                onChange={(e) => setDepartTime(e.target.value)}
                className="w-full bg-transparent outline-none text-sm
                  [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
            </Field>

            <Label>Pilih waktu kepulangan</Label>
            <Field
              icon={<Clock size={16} />}
              onIconClick={() => returnRef.current?.showPicker()}
            >
              <input
                ref={returnRef}
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-full bg-transparent outline-none text-sm
                  [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
            </Field>

            <Label>Jumlah tiket</Label>
            <Field icon={<User size={16} />}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPeople(Math.max(1, people - 1))}
                  className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-lg hover:bg-neutral-200"
                >
                  −
                </button>

                <span className="font-medium w-4 text-center">{people}</span>

                <button
                  type="button"
                  onClick={() => setPeople(Math.min(16, people + 1))}
                  className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-lg hover:bg-neutral-200"
                >
                  +
                </button>
              </div>
            </Field>
          </div>

          {/* PAY */}
          <button
            onClick={handleSubmit}
            className="w-full flex justify-between items-center bg-blue-600 text-white py-3 px-5 rounded-xl text-sm font-medium"
          >
            <span>Bayar Sekarang</span>
            <span>IDR {totalPrice.toLocaleString("id-ID")}</span>
          </button>
        </div>
      </div>
    </main>
  );
}

/* ================= UI PARTS ================= */

function Label({ children }: { children: string }) {
  return <p className="text-xs text-neutral-500">{children}</p>;
}

function Field({
  icon,
  children,
  onIconClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onIconClick?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border border-neutral-200 rounded-full px-4 py-2">
      <button type="button" onClick={onIconClick} className="text-neutral-400">
        {icon}
      </button>
      {children}
    </div>
  );
}
