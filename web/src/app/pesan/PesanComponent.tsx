"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MapPin, Calendar, Clock, User } from "lucide-react";
import { apiFetch } from "@/helpers/api";
import { DestinationsType } from "@/types/destination";

/* ================= TYPES ================= */

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

type OrderResponse = {
  id: number;
};

type PayResponse = {
  snapToken: string | null;
  redirectUrl: string | null;
};

/* ================= COMPONENT ================= */

export default function PesanComponent() {
  const searchParams = useSearchParams();
  const destinationId = Number(searchParams.get("destinationId"));

  const [destination, setDestination] = useState<DestinationsType | null>(null);
  const [loading, setLoading] = useState(true);

  /* form state */
  const [pickupLocationId, setPickupLocationId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [departTime, setDepartTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [people, setPeople] = useState(1);

  /* ui state */
  const [showConfirm, setShowConfirm] = useState(false);
  const [showError, setShowError] = useState(false);
  const [paying, setPaying] = useState(false);

  const dateRef = useRef<HTMLInputElement>(null);
  const departRef = useRef<HTMLInputElement>(null);
  const returnRef = useRef<HTMLInputElement>(null);

  /* ================= FETCH DESTINATION ================= */

  useEffect(() => {
    if (!destinationId) return;

    const fetchData = async () => {
      try {
        const res = await apiFetch<ApiResponse<DestinationsType>>(
          `/api/destinations/${destinationId}`
        );
        setDestination(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [destinationId]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!destination)
    return <p className="text-center mt-20">Destinasi tidak ditemukan</p>;

  const imageUrl = destination.imageUrl || "/images/default.jpg";
  const estimasiTotal = destination.price * people;

  /* ================= RENDER ================= */

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
            <span>Max 16 Orang</span>
            <span>12 Jam</span>
          </div>

          {/* FORM */}
          <div className="space-y-3 text-sm">
            <Label>Lokasi Penjemputan</Label>
            <Field icon={<MapPin size={16} />}>
              <select
                value={pickupLocationId ?? ""}
                onChange={(e) => setPickupLocationId(Number(e.target.value))}
                className="w-full bg-transparent outline-none text-sm"
              >
                <option value="">Pilih Lokasi</option>
                <option value="1">Terminal Rajabasa</option>
                <option value="2">Stasiun Tanjung Karang</option>
              </select>
            </Field>

            <Label>Tanggal</Label>
            <Field
              icon={<Calendar size={16} />}
              onIconClick={() => dateRef.current?.showPicker()}
            >
              <input
                ref={dateRef}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent outline-none text-sm [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
            </Field>

            <Label>Waktu Berangkat</Label>
            <Field
              icon={<Clock size={16} />}
              onIconClick={() => departRef.current?.showPicker()}
            >
              <input
                ref={departRef}
                type="time"
                value={departTime}
                onChange={(e) => setDepartTime(e.target.value)}
                className="w-full bg-transparent outline-none text-sm [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
            </Field>

            <Label>Waktu Pulang</Label>
            <Field
              icon={<Clock size={16} />}
              onIconClick={() => returnRef.current?.showPicker()}
            >
              <input
                ref={returnRef}
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-full bg-transparent outline-none text-sm [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
            </Field>

            <Label>Jumlah Tiket</Label>
            <Field icon={<User size={16} />}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPeople(Math.max(1, people - 1))}
                  className="w-8 h-8 rounded-full bg-neutral-100"
                >
                  −
                </button>
                <span className="font-medium">{people}</span>
                <button
                  type="button"
                  onClick={() => setPeople(Math.min(16, people + 1))}
                  className="w-8 h-8 rounded-full bg-neutral-100"
                >
                  +
                </button>
              </div>
            </Field>
          </div>

          {/* OPEN CONFIRM */}
          <button
            onClick={() => {
              if (!pickupLocationId || !date || !departTime || !returnTime) {
                setShowError(true);
                return;
              }
              setShowConfirm(true);
            }}
            className="w-full flex justify-between items-center bg-blue-600 text-white py-3 px-5 rounded-xl text-sm font-medium"
          >
            <span>Pesan</span>
            <span>IDR {estimasiTotal.toLocaleString("id-ID")}</span>
          </button>
        </div>
      </div>

      {/* CONFIRM POPUP */}
      {showConfirm && (
        <ConfirmPopup
          destination={destination}
          pickupLocationId={pickupLocationId!}
          date={date}
          departTime={departTime}
          returnTime={returnTime}
          people={people}
          estimasiTotal={estimasiTotal}
          paying={paying}
          onCancel={() => setShowConfirm(false)}
          onConfirm={async () => {
            try {
              setPaying(true);

              // 1️⃣ CREATE ORDER
              const orderRes = await apiFetch<ApiResponse<OrderResponse>>(
                "/api/orders",
                {
                  method: "POST",
                  body: JSON.stringify({
                    destinationId: destination.id,
                    pickupLocationId,
                    quantity: people,
                    date,
                    departureTime: departTime,
                    returnTime,
                  }),
                }
              );

              // 2️⃣ PAY ORDER
              const payRes = await apiFetch<ApiResponse<PayResponse>>(
                `/api/orders/${orderRes.data.id}/pay`,
                {
                  method: "POST",
                }
              );

              // 3️⃣ REDIRECT
              if (payRes.data.redirectUrl) {
                window.location.href = payRes.data.redirectUrl;
              } else {
                throw new Error("Redirect URL tidak tersedia");
              }
            } catch (err) {
              console.error(err);
              setShowError(true);
            } finally {
              setPaying(false);
            }
          }}
        />
      )}

      {/* ERROR */}
      {showError && (
        <Popup
          title="Gagal ❌"
          desc="Lengkapi data atau coba lagi."
          onClose={() => setShowError(false)}
        />
      )}
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

function Popup({
  title,
  desc,
  onClose,
}: {
  title: string;
  desc: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 text-center">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-neutral-500 mb-6">{desc}</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium"
        >
          OK
        </button>
      </div>
    </div>
  );
}

function ConfirmPopup({
  destination,
  pickupLocationId,
  date,
  departTime,
  returnTime,
  people,
  estimasiTotal,
  paying,
  onCancel,
  onConfirm,
}: {
  destination: DestinationsType;
  pickupLocationId: number;
  date: string;
  departTime: string;
  returnTime: string;
  people: number;
  estimasiTotal: number;
  paying: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const pickupName =
    pickupLocationId === 1 ? "Terminal Rajabasa" : "Stasiun Tanjung Karang";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-center">
          Konfirmasi Pesanan
        </h3>

        <div className="text-sm space-y-2 text-neutral-600">
          <p>
            <b>Destinasi:</b> {destination.name}
          </p>
          <p>
            <b>Pickup:</b> {pickupName}
          </p>
          <p>
            <b>Tanggal:</b> {date}
          </p>
          <p>
            <b>Waktu:</b> {departTime} - {returnTime}
          </p>
          <p>
            <b>Jumlah:</b> {people} orang
          </p>
        </div>

        <div className="flex justify-between font-semibold">
          <span>Estimasi Total</span>
          <span>IDR {estimasiTotal.toLocaleString("id-ID")}</span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full py-2 rounded-xl border text-sm"
          >
            Batal
          </button>
          <button
            disabled={paying}
            onClick={onConfirm}
            className="w-full py-2 rounded-xl bg-blue-600 text-white text-sm disabled:opacity-60"
          >
            {paying ? "Memproses..." : "Pesan Sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}
