export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h4 className="font-semibold text-lg">LamiGo</h4>
          <p className="text-sm text-slate-300 mt-2">Jelajahi alam Lampung bersama kami.</p>
        </div>
        <div className="text-sm text-slate-300">
          © {new Date().getFullYear()} LamiGo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
