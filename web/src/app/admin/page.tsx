// app/admin/page.tsx
import StatsCard from "./components/StatsCard";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Destinasi" value="14" />
        <StatsCard title="Kategori Wisata" value="5" />
        <StatsCard title="Pengguna" value="212" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl p-6 shadow">
          <h3 className="font-semibold text-gray-700 mb-3">Recent Activities</h3>
          <p className="text-sm text-gray-500">Activity list / charts here</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="font-semibold text-gray-700 mb-3">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            <a href="/admin/destinasi/tambah" className="px-3 py-2 bg-blue-600 text-white rounded">Tambah Destinasi</a>
            <a href="/admin/kategori-wisata" className="px-3 py-2 bg-gray-100 rounded">Kelola Kategori</a>
          </div>
        </div>
      </div>
    </div>
  );
}
