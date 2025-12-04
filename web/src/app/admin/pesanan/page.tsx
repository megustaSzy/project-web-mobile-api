"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import type { OrdersResponse, Order } from "@/types/order";

export default function PesananPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    apiFetch<OrdersResponse>("/orders")
      .then((res) => {
        setOrders(res.data.items ?? []);
      })
      .catch(() => setOrders([]));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Manajemen Pesanan
      </h2>

      <div className="bg-white p-4 rounded shadow">
        {orders.length === 0 ? (
          <p>Tidak ada pesanan</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-500">
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td>{o.id}</td>
                  <td>{o.user.name}</td>
                  <td>Rp {o.total.toLocaleString("id-ID")}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
