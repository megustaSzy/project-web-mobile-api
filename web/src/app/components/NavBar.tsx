// /* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { apiFetch } from "@/helpers/api";

// ========================
// TIPE API
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

// ========================
// KOMPONEN NAVBAR
// ========================
export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    name: "User",
    avatar: "/images/profile.jpg",
  });

  const [language, setLanguage] = useState("id");
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const translationSource = {
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

  const [translations] = useState(translationSource);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const buildAvatarUrl = (avatar?: string | null) => {
    if (!avatar) return "/images/profile.jpg";
    return avatar.startsWith("http") ? avatar : `${API_URL}${avatar}`;
  };

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // ==========================
  // SCROLL EFFECT
  // ==========================
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ==========================
  // INIT TOKEN + PROFILE
  // ==========================
  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      jwtDecode(token);
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await apiFetch<ApiProfileResponse>("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res?.data) {
          setUserData({
            name: res.data.name || "User",
            avatar: buildAvatarUrl(res.data.avatar),
          });
          localStorage.setItem(
            "profile",
            JSON.stringify({
              name: res.data.name,
              avatar: res.data.avatar ?? "/images/profile.jpg",
            })
          );
        }
      } catch (err) {
        console.error("Gagal fetch profile:", err);
        setIsLoggedIn(false);
      }
    };

    loadProfile();
  }, []);

  // ==========================
  // INIT LANGUAGE
  // ==========================
  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "id";
    setLanguage(savedLang);
  }, []);

  // ==========================
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // ==========================
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ==========================
  // LOGOUT
  // ==========================
  const handleLogout = () => {
    Cookies.remove("accessToken");
    localStorage.removeItem("profile");
    setIsLoggedIn(false);
    setUserData({ name: "User", avatar: "/images/profile.jpg" });
  };

  const textColor = scrolled ? "text-gray-800" : "text-white";
  const borderColor = scrolled ? "border-gray-700" : "border-white";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md border-b border-gray-200" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center h-16">
        {/* LOGO */}
        <Image src="/images/logo.png" alt="Logo" width={40} height={40} />

        {/* DESKTOP MENU */}
        <nav
          className={`hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8 ${textColor}`}
        >
          <Link href="/">{translations.home}</Link>
          <Link href="/about">{translations.about}</Link>
          <Link href="/tourlist">{translations.tour}</Link>
          <Link href="/tiket">{translations.ticket}</Link>
          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {translations.contact}
          </button>
        </nav>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex gap-4 ml-auto items-center">
          {/* LANGUAGE */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((prev) => !prev)}
              className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm ${textColor}`}
            >
              {language.toUpperCase()}
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
              />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white shadow rounded-md overflow-hidden z-50">
                <button
                  onClick={() => {
                    setLanguage("id");
                    localStorage.setItem("language", "id");
                    setLangOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  🇮🇩 Indonesia
                </button>
                <button
                  onClick={() => {
                    setLanguage("en");
                    localStorage.setItem("language", "en");
                    setLangOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  🇺🇸 English
                </button>
              </div>
            )}
          </div>

          {/* PROFILE */}
          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className={`flex items-center gap-2 px-2 py-1 rounded-md text-sm-gray-100 transition ${textColor}`}
              >
                <Image
                  src={userData.avatar}
                  width={32}
                  height={32}
                  alt="Profile"
                  className="rounded-full"
                  loader={({ src }) =>
                    src.startsWith("http") ? src : `${API_URL}${src}`
                  }
                />
                <span className="text-sm">{userData.name}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white shadow rounded-md overflow-hidden z-50">
                  <Link
                    href="/profil"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-800"
                    onClick={() => setProfileOpen(false)}
                  >
                    {translations.editProfile}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 text-sm"
                  >
                    {translations.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={`px-4 py-1 rounded-full border ${textColor} ${borderColor}`}
            >
              {translations.login}
            </Link>
          )}
        </div>

        {/* BURGER MENU */}
        <button onClick={() => setOpen((p) => !p)} className="md:hidden ml-auto p-2">
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
        <div className="bg-white border-t px-4 py-4 text-gray-800">
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
                <Link href="/profil" onClick={() => setOpen(false)} className="py-2">
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
          </nav>
        </div>
      </div>
    </header>
  );
}
