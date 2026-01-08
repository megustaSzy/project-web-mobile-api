"use client";

import { useRef, useState } from "react";
import { MapPin, Calendar, Clock, User } from "lucide-react";

type PickupType = {
  id: number;
  name: string;
};

type FormValue = {
  pickupLocationId: number;
  date: string;
  departTime: string;
  returnTime: string;
  people: number;
};

export default function PesanForm({
  pickupLocations,
  price,
  onSubmit,
}: {
  pickupLocations: PickupType[];
  price: number;
  onSubmit: (value: FormValue) => void;
}) {
  const [pickupLocationId, setPickupLocationId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [departTime, setDepartTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [people, setPeople] = useState(1);

  const dateRef = useRef<HTMLInputElement>(null);
  const estimasiTotal = price * people;

  const handleSubmit = () => {
    if (!pickupLocationId || !date || !departTime || !returnTime) return;

    onSubmit({
      pickupLocationId,
      date,
      departTime,
      returnTime,
      people,
    });
  };

  return (
    <div className="px-5 pb-5 space-y-4">
      {/* FORM */}
      <div className="space-y-3 text-sm">
        <Label>Lokasi Penjemputan</Label>
        <Field icon={<MapPin size={16} />}>
          <select
            value={pickupLocationId ?? ""}
            onChange={(e) =>
              setPickupLocationId(
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full bg-transparent outline-none"
          >
            <option value="">Pilih Lokasi</option>
            {pickupLocations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
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
            className="w-full bg-transparent outline-none [&::-webkit-calendar-picker-indicator]:opacity-0"
          />
        </Field>

        <Label>Waktu Berangkat</Label>
        <Field icon={<Clock size={16} />}>
          <select
            value={departTime}
            onChange={(e) => setDepartTime(e.target.value)}
            className="w-full bg-transparent outline-none"
          >
            <option value="">Pilih Jam</option>
            {Array.from({ length: 8 }, (_, i) => {
              const hour = 7 + i;
              const v = `${hour.toString().padStart(2, "0")}:00`;
              return (
                <option key={v} value={v}>
                  {v}
                </option>
              );
            })}
          </select>
        </Field>

        <Label>Waktu Pulang</Label>
        <Field icon={<Clock size={16} />}>
          <select
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            className="w-full bg-transparent outline-none"
          >
            <option value="">Pilih Jam</option>
            {Array.from({ length: 6 }, (_, i) => {
              const hour = 14 + i;
              const v = `${hour.toString().padStart(2, "0")}:00`;
              return (
                <option key={v} value={v}>
                  {v}
                </option>
              );
            })}
          </select>
        </Field>

        <Label>Jumlah Tiket</Label>
        <Field icon={<User size={16} />}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPeople((p) => Math.max(1, p - 1))}
              className="w-6 h-6 rounded-full bg-neutral-200"
            >
              −
            </button>
            <span>{people}</span>
            <button
              onClick={() => setPeople((p) => Math.min(16, p + 1))}
              className="w-6 h-6 rounded-full bg-neutral-200"
            >
              +
            </button>
          </div>
        </Field>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full flex justify-between items-center bg-blue-600 text-white py-3 px-5 rounded-xl text-sm font-medium"
      >
        <span>Pesan</span>
        <span>IDR {estimasiTotal.toLocaleString("id-ID")}</span>
      </button>
    </div>
  );
}

/* helpers */
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
    <div className="flex items-center gap-3 border rounded-full px-4 py-2">
      <button type="button" onClick={onIconClick}>
        {icon}
      </button>
      {children}
    </div>
  );
}
