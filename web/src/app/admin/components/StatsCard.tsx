"use client";

import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { title: "Total Revenue", value: "$1,250.00" },
  { title: "New Customers", value: "1,234" },
  { title: "Active Accounts", value: "45,678" },
  { title: "Growth Rate", value: "4.5%" },
];

export default function StatsCard() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((item, i) => (
        <Card key={i}>
          <CardContent>
            <p className="text-sm text-slate-500 mt-2">{item.title}</p>
            <p className="text-2xl font-semibold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
