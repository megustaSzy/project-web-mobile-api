"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import { MapPin, Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { apiFetch } from "@/helpers/api";
import { DestinationsType } from "@/types/destination";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* ================= TYPES ================= */

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

type PickupType = {
  id: number;
  name: string;
};

/* ================= HELPER ================= */

const generateTimes = (start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) => {
    const hour = start + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

/* ================= COMPONENT ================= */

export default function PesanComponent() {
  const searchParams = useSearchParams();
  const destinationId = Number(searchParams.get("destinationId"));

  const [destination, setDestination] = useState<DestinationsType | null>(null);
  const [pickupLocations, setPickupLocations] = useState<PickupType[]>([]);
  const [loading, setLoading] = useState(true);

  /* form state */
  const [pickupLocationId, setPickupLocationId] = useState<number | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [departTime, setDepartTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [people, setPeople] = useState(1);

  /* popover state */
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openDepart, setOpenDepart] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);

  /* ui state */
  const [showError, setShowError] = useState(false);
  const [errorMessage] = useState("Lengkapi data atau coba lagi.");

  useEffect(() => {
    if (!showError) return;
    const timer = setTimeout(() => setShowError(false), 2000);
    return () => clearTimeout(timer);
  }, [showError]);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!destinationId) return;
    apiFetch<ApiResponse<DestinationsType>>(
      `/api/destinations/${destinationId}`
    )
      .then((res) => setDestination(res.data))
      .finally(() => setLoading(false));
  }, [destinationId]);

  useEffect(() => {
    apiFetch<ApiResponse<PickupType[]>>("/api/pickup-locations")
      .then((res) => setPickupLocations(res.data || []))
      .catch(() => setPickupLocations([]));
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!destination)
    return <p className="text-center mt-20">Destinasi tidak ditemukan</p>;

  const estimasiTotal = destination.price * people;

  /* ================= RENDER ================= */

  return (
    <main className="min-h-screen bg-neutral-100 flex justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow overflow-hidden">
        {/* IMAGE */}
        <div className="relative h-36">
          <Image
            src={destination.imageUrl || "/images/default.jpg"}
            alt={destination.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h1 className="text-base font-semibold">{destination.name}</h1>
            <p className="flex items-center gap-1 text-xs text-neutral-500">
              <MapPin size={12} /> {destination.category.name}
            </p>
          </div>

          <div className="flex justify-between bg-blue-600 text-white text-xs rounded-full px-4 py-2">
            <span>Max 16 Orang</span>
            <span>12 Jam</span>
          </div>

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
            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-full"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-neutral-400" />
                  {date ? (
                    format(date, "dd MMMM yyyy", { locale: id })
                  ) : (
                    <span className="text-neutral-400">Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setOpenCalendar(false);
                  }}
                  disabled={(d) => d < new Date()}
                />
              </PopoverContent>
            </Popover>

            <Label>Waktu Berangkat</Label>
            <TimePicker
              value={departTime}
              onChange={setDepartTime}
              open={openDepart}
              setOpen={setOpenDepart}
              placeholder="Pilih jam berangkat"
              times={generateTimes(7, 14)}
            />

            <Label>Waktu Pulang</Label>
            <TimePicker
              value={returnTime}
              onChange={setReturnTime}
              open={openReturn}
              setOpen={setOpenReturn}
              placeholder="Pilih jam pulang"
              times={generateTimes(14, 20)}
            />

            <Label>Jumlah Tiket</Label>
            <Field icon={<User size={16} />}>
              <div className="flex items-center gap-3">
                <button onClick={() => setPeople((p) => Math.max(1, p - 1))}>
                  −
                </button>
                <span>{people}</span>
                <button onClick={() => setPeople((p) => Math.min(16, p + 1))}>
                  +
                </button>
              </div>
            </Field>
          </div>

          <button
            onClick={() => {
              if (!pickupLocationId || !date || !departTime || !returnTime) {
                setShowError(true);
                return;
              }
            }}
            className="w-full flex justify-between bg-blue-600 text-white py-3 px-5 rounded-xl"
          >
            <span>Pesan</span>
            <span>IDR {estimasiTotal.toLocaleString("id-ID")}</span>
          </button>
        </div>
      </div>

      {showError && (
        <Popup
          title="Gagal ❌"
          desc={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}
    </main>
  );
}

/* ================= UI PARTS ================= */

function Label({ children }: { children: string }) {
  return <p className="text-xs font-medium text-neutral-600">{children}</p>;
}

type FieldProps = {
  icon: ReactNode;
  children: ReactNode;
};

function Field({ icon, children }: FieldProps) {
  return (
    <div className="flex items-center gap-3 border rounded-full px-4 py-2">
      <span className="text-neutral-400">{icon}</span>
      {children}
    </div>
  );
}

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  placeholder: string;
  times: string[];
};

function TimePicker({
  value,
  onChange,
  open,
  setOpen,
  placeholder,
  times,
}: TimePickerProps) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start rounded-full">
          <Clock className="mr-2 h-4 w-4 text-neutral-400" />
          {value || <span className="text-neutral-400">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1">
        {times.map((t) => (
          <button
            key={t}
            onClick={() => {
              onChange(t);
              setOpen(false);
            }}
            className={`w-full px-3 py-2 rounded-lg text-left text-sm ${
              value === t ? "bg-blue-600 text-white" : "hover:bg-blue-50"
            }`}
          >
            {t}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

type PopupProps = {
  title: string;
  desc: string;
  onClose: () => void;
};

function Popup({ title, desc, onClose }: PopupProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 text-center">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-neutral-500">{desc}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          OK
        </button>
      </div>
    </div>
  );
}
