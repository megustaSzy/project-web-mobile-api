/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiDestinationItem } from "@/types/destination";

type ApiResponse = {
  status: number;
  message: string;
  data: ApiDestinationItem;
};

export default function EditDestinasi() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [image, setImage] = useState<string | null>(null);

  // ========================
  // GET DATA DESTINASI
  // ========================
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/destination/${id}`);
        if (!res.ok) throw new Error(`Fetch gagal (${res.status})`);

        const json: ApiResponse = await res.json();
        const d = json.data;

        if (!d) throw new Error("Data tidak ditemukan");

        setName(d.name ?? "");
        setDesc(d.description ?? "");
        setPrice(d.price ?? "");
        setImage(d.imageUrl ?? null);
      } catch (err) {
        console.error("GET destinasi error:", err);
        alert("Gagal mengambil data destinasi");
        router.push("/admin/destinasi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  // ========================
  // SUBMIT UPDATE
  // ========================
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await fetch(`/api/destination/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: desc,
          price: price === "" ? null : price,
        }),
      });

      if (!res.ok) throw new Error(`Update gagal (${res.status})`);

      alert("Berhasil update destinasi");
      router.push("/admin/destinasi");
    } catch (err) {
      console.error("PUT destinasi error:", err);
      alert("Gagal update destinasi");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Edit Destinasi
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-xl"
      >
        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Nama destinasi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <textarea
            placeholder="Deskripsi"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border p-2 rounded"
            rows={4}
          />

          <input
            type="number"
            placeholder="Harga"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border p-2 rounded"
          />

          {image && (
            <img
              src={image}
              alt="Preview"
              className="w-32 rounded-lg"
            />
          )}

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Update
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-100 rounded"
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
