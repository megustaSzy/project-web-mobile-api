// app/admin/components/StatsCard.tsx
export default function StatsCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="p-5 bg-white rounded-xl shadow-md border-l-4 border-blue-600">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-2 text-gray-800">{value}</p>
    </div>
  );
}
