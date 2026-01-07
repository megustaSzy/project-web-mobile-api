/* eslint-disable @next/next/no-img-element */
export default function Footer() {
  return (
    <footer
  id="contact"
  className="relative z-10 bg-[#0c1220] text-white pt-16 pb-8 overflow-hidden"
>

      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          // backgroundImage: "url('/images/texturegaris.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Konten Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Kiri: Logo & Lokasi */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="LamiGo Logo"
              className="w-12 h-12 object-contain"
            />
            <h2 className="text-base font-semibold leading-tight">
              LamiGo Destination Lampung
            </h2>
          </div>
          <p className="text-slate-300 text-sm mt-3 leading-relaxed">
            Kota Bandar Lampung, Lampung<br />Indonesia
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li><a href="#" className="hover:text-white">About LamiGo</a></li>
            <li><a href="#" className="hover:text-white">About LamiGo</a></li>
            <li><a href="#" className="hover:text-white">About LamiGo</a></li>
            <li><a href="#" className="hover:text-white">About LamiGo</a></li>
            <li><a href="#" className="hover:text-white">About LamiGo</a></li>
          </ul>
        </div>

        {/* Top Destination */}
        <div>
          <h3 className="font-semibold mb-4 text-white">Top Destination</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li><a href="#" className="hover:text-white">Rio The Beach</a></li>
            <li><a href="#" className="hover:text-white">Pahawang</a></li>
            <li><a href="#" className="hover:text-white">Green Ely Krakatoa</a></li>
            <li><a href="#" className="hover:text-white">Senaya Beach</a></li>
            <li><a href="#" className="hover:text-white">Marina Beach</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-4 text-white">Contact Info</h3>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li className="flex items-start gap-3">
              <img src="/images/8.png" alt="WhatsApp" className="w-5 h-5 mt-0.5" />
              <div>
                <p>Whatsapp</p>
                <p className="font-semibold text-white">+62851 0088 9876</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <img src="/images/9.png" alt="Email" className="w-5 h-5 mt-0.5" />
              <div>
                <p>Email</p>
                <p className="font-semibold text-white">LamiGoLampung.com</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <img src="/images/10.png" alt="Telpon" className="w-5 h-5 mt-0.5" />
              <div>
                <p>Telpon</p>
                <p className="font-semibold text-white">0876 8800 9876</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative z-10 border-t border-slate-800 mt-10 pt-4 text-center text-slate-400 text-sm">
        Copyright LamiGo 2025
      </div>
    </footer>
  );
}
