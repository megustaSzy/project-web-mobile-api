// app/admin/layout.tsx
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f8ff]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
