"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { apiFetch } from "@/helpers/api"; // <-- pastikan helper ini tersedia

// ========================
// TIPE PROFILE DARI API
// ========================
export type ApiProfileResponse = {
  status: number;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  };
};

interface UserProfile {
  name?: string;
  avatar?: string;
}

interface TranslationMap {
  home: string;
  about: string;
  tour: string;
  ticket: string;
  contact: string;
  login: string;
  signup: string;
  editProfile: string;
  logout: string;
}

interface TranslateApiResponse {
  translated?: string;
  error?: string;
}

export default function NavBar() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [openLang, setOpenLang] = useState(false);

  // default profile (keamanan jika API gagal)
  const [userData, setUserData] = useState<UserProfile>({
    name: "User",
    avatar: "/images/profile.jpg",
  });

  const [language, setLanguage] = useState<string>("id");

  const translationSource: TranslationMap = {
    home: "Beranda",
    about: "Tentang Kami",
    tour: "Daftar Wisata",
    ticket: "Tiket Saya",
    contact: "Kontak",
    login: "Masuk",
    signup: "Daftar",
    editProfile: "Edit Profil",
    logout: "Keluar",
  };

  const [translations, setTranslations] =
    useState<TranslationMap>(translationSource);

  /* =========================
     FETCH PROFILE FROM API
     ========================= */
  const fetchProfileFromAPI = async () => {
    try {
      const res = await apiFetch<ApiProfileResponse>("/api/users/profile");
      if (res && res.data) {
        setUserData({
          name: res.data.name ?? "User",
          avatar: res.data.avatar ?? "/images/profile.jpg",
        });
        setIsLoggedIn(true);
        // simpan ke localStorage sebagai cache cepat (opsional)
        try {
          if (typeof window !== "undefined")
            localStorage.setItem(
              "profile",
              JSON.stringify({
                name: res.data.name,
                avatar: res.data.avatar ?? "/images/profile.jpg",
              })
            );
        } catch {}
      } else {
        // jika response tidak memuat data, treat as not logged
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("Gagal mengambil profil:", err);
      // jika fetch error (mis. 401), pastikan flag login false
      setIsLoggedIn(false);
    }
  };

  /* =========================
     Load initial data (language, translations, profile)
     ========================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // language (safe fallback)
    const savedLang = localStorage.getItem("language") ?? "id";
    setLanguage(savedLang);

    // translations
    const savedTrans = localStorage.getItem("translations");
    if (savedTrans) {
      try {
        setTranslations(JSON.parse(savedTrans) as TranslationMap);
      } catch {
        setTranslations(translationSource);
      }
    } else {
      // jika belum ada translations dan bahasa bukan id, fetch translations in background
      if (savedLang !== "id") {
        translateWithGoogle(savedLang).then((t) => {
          setTranslations(t);
          localStorage.setItem("translations", JSON.stringify(t));
        });
      } else {
        setTranslations(translationSource);
      }
    }

    // load profile: prefer localStorage cache untuk render cepat
    const token = localStorage.getItem("token");
    const storedProfile = localStorage.getItem("profile");

    setIsLoggedIn(Boolean(token));

    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile) as UserProfile;
        setUserData({
          name: parsed?.name ?? "User",
          avatar: parsed?.avatar ?? "/images/profile.jpg",
        });
      } catch (err) {
        console.warn("Gagal parsing profile dari localStorage:", err);
      }
    }

    // jika token ada, ambil versi paling up-to-date dari API
    if (token) {
      fetchProfileFromAPI();
    }

    // storage listener untuk detect perubahan di tab lain
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "profile") {
        const newVal = e.newValue;
        if (!newVal) {
          setUserData({ name: "User", avatar: "/images/profile.jpg" });
          setIsLoggedIn(false);
        } else {
          try {
            const parsed = JSON.parse(newVal) as UserProfile;
            setUserData({
              name: parsed?.name ?? "User",
              avatar: parsed?.avatar ?? "/images/profile.jpg",
            });
            // apabila profile di storage berubah biasanya karena login/logout di tab lain
            setIsLoggedIn(Boolean(localStorage.getItem("token")));
          } catch {}
        }
      }
      if (e.key === "language") {
        const newLang = e.newValue ?? "id";
        setLanguage(newLang);
      }
      if (e.key === "token" && e.newValue === null) {
        // token dihapus di tab lain => logout
        setIsLoggedIn(false);
        setUserData({ name: "User", avatar: "/images/profile.jpg" });
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
    // NOTE: intentionally empty deps so runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll effect
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* =========================
     LOGOUT
     ========================= */
  const handleLogout = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("profile");
    }
    setIsLoggedIn(false);
    setUserData({ name: "User", avatar: "/images/profile.jpg" });
  };

  /* =========================
     TRANSLATE HELPERS (SAMA DENGAN SEMULA)
     ========================= */
  const translateWithGoogle = async (
    target: string
  ): Promise<TranslationMap> => {
    // fallback: jika target sama dengan 'id', kembalikan source
    if (target === "id") return translationSource;

    const result: Partial<TranslationMap> = {};
    // gunakan loop atas key yang dijamin ada
    const keys = Object.keys(translationSource) as (keyof TranslationMap)[];

    for (const key of keys) {
      const textToTranslate = translationSource[key];

      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: textToTranslate, target }),
        });

        if (!res.ok) {
          // jika error, fallback ke teks asli
          result[key] = translationSource[key];
          continue;
        }

        const data = (await res.json()) as TranslateApiResponse;
        result[key] = data.translated ?? translationSource[key];
      } catch (err) {
        // jika fetch error, gunakan fallback
        console.warn("Translate request error:", err);
        result[key] = translationSource[key];
      }
    }

    // Type assertion karena kita yakin semua key sudah diisi
    return result as TranslationMap;
  };

  const handleChangeLanguage = async (lang: string) => {
    // simpan terlebih dahulu (agar UI langsung berubah uppercase dll)
    setLanguage(lang);
    if (typeof window !== "undefined") localStorage.setItem("language", lang);

    // jika bahasa id maka langsung pakai source
    if (lang === "id") {
      setTranslations(translationSource);
      if (typeof window !== "undefined")
        localStorage.setItem("translations", JSON.stringify(translationSource));
      return;
    }

    // Panggil translate dan simpan
    const newTrans = await translateWithGoogle(lang);
    setTranslations(newTrans);
    if (typeof window !== "undefined")
      localStorage.setItem("translations", JSON.stringify(newTrans));
  };

  /* =========================
     RETURN (JSX ASLI TANPA PERUBAHAN)
     ========================= */
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md border-b border-gray-200"
          : "bg-transparent border-b border-white/10"
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
        </div>

        {/* MENU DESKTOP */}
        <nav
          className={`hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8 ${
            scrolled ? "text-gray-800" : "text-white"
          }`}
        >
          <Link href="/">{translations.home}</Link>
          <Link href="/about">{translations.about}</Link>
          <Link href="/tourlist">{translations.tour}</Link>
          <Link href="/tiket">{translations.ticket}</Link>

          <button
            onClick={() =>
              typeof document !== "undefined" &&
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {translations.contact}
          </button>
        </nav>

        {/* RIGHT */}
        <div className="hidden md:flex gap-3 ml-auto items-center relative">
          {/* LANGUAGE */}
          <div className="relative">
            <button
              onClick={() => setOpenLang((prev: boolean) => !prev)}
              className={`gap-1 flex items-center px-2 py-1 rounded-full transition-all duration-200
    ${scrolled ? "text-gray-700" : "text-white"}
    hover:scale-105
  `}
            >
              <span className="transition-transform duration-200">
                {language.toUpperCase()}
              </span>

              {/* ICON PANAH */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 transition-transform duration-200"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                />
              </svg>
            </button>

            {/* DROPDOWN */}
            {openLang && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg bg-white overflow-hidden animate-fadeIn">
                <button
                  onClick={() => {
                    handleChangeLanguage("id");
                    setOpenLang(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left"
                >
                  🇮🇩 Indonesia
                </button>

                <button
                  onClick={() => {
                    handleChangeLanguage("en");
                    setOpenLang(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left"
                >
                  🇺🇸 English
                </button>
              </div>
            )}
          </div>

          {/* PROFILE / LOGIN */}
          {isLoggedIn ? (
            <div className="relative group flex items-center gap-2 cursor-pointer">
              <Image
                src={(userData.avatar ?? "/images/profile.jpg") as string}
                width={35}
                height={35}
                alt="Profile"
                className="rounded-full"
              />
              <span>{userData.name}</span>

              <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                <Link
                  href="/profil"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  {translations.editProfile}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                >
                  {translations.logout}
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className={`px-3 py-1 rounded-full border ${
                scrolled
                  ? "text-gray-700 border-gray-700"
                  : "text-white border-white"
              }`}
            >
              {translations.login}
            </Link>
          )}
        </div>

        {/* BURGER */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden ml-auto p-2"
        >
          {open ? (
            <X className={scrolled ? "text-gray-800" : "text-white"} />
          ) : (
            <Menu className={scrolled ? "text-gray-800" : "text-white"} />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t px-4 py-3 text-gray-800">
          <nav className="flex flex-col gap-4 text-center">
            <Link href="/" onClick={() => setOpen(false)}>
              {translations.home}
            </Link>
            <Link href="/about" onClick={() => setOpen(false)}>
              {translations.about}
            </Link>
            <Link href="/tourlist" onClick={() => setOpen(false)}>
              {translations.tour}
            </Link>
            <Link href="/tiket" onClick={() => setOpen(false)}>
              {translations.ticket}
            </Link>
            <button onClick={() => setOpen(false)}>{translations.contact}</button>

            {isLoggedIn ? (
              <>
                <Link
                  href="/profil"
                  className="py-2"
                  onClick={() => setOpen(false)}
                >
                  {translations.editProfile}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="py-2 bg-red-500 text-white rounded-md"
                >
                  {translations.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="py-2 bg-blue-600 text-white rounded-md"
                >
                  {translations.login}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="py-2 border border-blue-600 text-blue-600 rounded-md"
                >
                  {translations.signup}
                </Link>
              </>
            )}

            <div className="border-t mt-3 pt-3 flex justify-center gap-4">
              <button
                onClick={() => handleChangeLanguage("id")}
                className={`px-3 py-1 rounded-md ${
                  language === "id" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                🇮🇩 ID
              </button>
              <button
                onClick={() => handleChangeLanguage("en")}
                className={`px-3 py-1 rounded-md ${
                  language === "en" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                🇺🇸 EN
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
