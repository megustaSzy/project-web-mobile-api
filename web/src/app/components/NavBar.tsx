"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ name?: string; avatar?: string }>(
    {
      name: "User",
      avatar: "/images/profile.jpg",
    }
  );

  const [language, setLanguage] = useState("id");

  // 🔹 Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Load Language
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) setLanguage(savedLang);
  }, []);

  const handleChangeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  // 🔹 Load Profile & Token
  const loadLocalProfile = () => {
    const token = localStorage.getItem("token");
    const storedProfile = localStorage.getItem("profile");

    if (token) setIsLoggedIn(true);
    else setIsLoggedIn(false);

    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        setUserData({
          name: parsed.name || "User",
          avatar: parsed.avatar || "/images/profile.jpg",
        });
      } catch {
        console.warn("Profile rusak");
      }
    }
  };

  useEffect(() => {
    loadLocalProfile();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "profile") loadLocalProfile();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserData({ name: "User", avatar: "/images/profile.jpg" });
  };

  // 🌎 TEXT SESUAI BAHASA
  const t = {
    home: language === "id" ? "Beranda" : "Home",
    about: language === "id" ? "Tentang Kami" : "About Us",
    tour: language === "id" ? "Daftar Wisata" : "Tour List",
    ticket: language === "id" ? "Tiket Saya" : "My Ticket",
    contact: language === "id" ? "Kontak" : "Contact",
    login: language === "id" ? "Masuk" : "Login",
    signup: language === "id" ? "Daftar" : "Sign Up",
    editProfile: language === "id" ? "Edit Profil" : "Edit Profile",
    logout: language === "id" ? "Keluar" : "Logout",
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md border-b border-gray-200"
          : "bg-transparent border-b border-white/10"
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
        </div>

        {/* MENU DESKTOP */}
        <nav
          className={`hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8 transition-colors duration-300 ${
            scrolled ? "text-gray-800" : "text-white"
          }`}
        >
          <Link href="/" className="hover:text-blue-500">{t.home}</Link>
          <Link href="/about" className="hover:text-blue-500">{t.about}</Link>
          <Link href="/tourlist" className="hover:text-blue-500">{t.tour}</Link>
          <Link href="/tiket" className="hover:text-blue-500">{t.ticket}</Link>

          <button
            onClick={() => {
              setOpen(false);
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="hover:text-blue-500 transition-colors duration-300"
          >
            {t.contact}
          </button>
        </nav>

        {/* BAGIAN KANAN DESKTOP */}
        <div className="hidden md:flex gap-3 ml-auto items-center relative">
          
          {/* 🌍 Language Switcher */}
          <div className="relative group">
            <button
              className={`px-3 py-1 rounded-md text-sm border transition ${
                scrolled ? "text-gray-800 border-gray-600" : "text-white border-white"
              }`}
            >
              {language === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}
            </button>

            <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <button
                onClick={() => handleChangeLanguage("id")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                🇮🇩 Indonesia
              </button>
              <button
                onClick={() => handleChangeLanguage("en")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* PROFIL / LOGIN */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 group relative cursor-pointer">
              <Image
                src={userData.avatar || "/images/profile.jpg"}
                alt="Profile"
                width={35}
                height={35}
                className="rounded-full border border-gray-300 object-cover"
              />
              <span
                className={`text-sm font-medium ${
                  scrolled ? "text-gray-800" : "text-white"
                }`}
              >
                {userData.name}
              </span>

              <div className="absolute right-0 top-10 bg-white rounded-md shadow-lg w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link
                  href="/profil"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  {t.editProfile}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-red-100 hover:text-red-600"
                >
                  {t.logout}
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className={`px-3 py-1 text-sm rounded-full border transition ${
                scrolled
                  ? "border-gray-700 text-gray-700 hover:bg-blue-600 hover:text-white"
                  : "border-white text-white hover:bg-blue-600 hover:text-white"
              }`}
            >
              {t.login}
            </Link>
          )}
        </div>

        {/* BURGER BUTTON */}
        <button onClick={() => setOpen(!open)} className="md:hidden ml-auto p-2">
          {open ? (
            <X className={scrolled ? "text-gray-800" : "text-white"} />
          ) : (
            <Menu className={scrolled ? "text-gray-800" : "text-white"} />
          )}
        </button>
      </div>

      {/* MENU MOBILE */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`border-t px-4 py-3 ${
            scrolled
              ? "bg-white text-gray-800"
              : "bg-white/20 backdrop-blur-md text-white"
          }`}
        >
          <nav className="flex flex-col gap-4 text-center font-medium">
            <Link href="/" onClick={() => setOpen(false)}>{t.home}</Link>
            <Link href="/about" onClick={() => setOpen(false)}>{t.about}</Link>
            <Link href="/tourlist" onClick={() => setOpen(false)}>{t.tour}</Link>
            <Link href="#tickets" onClick={() => setOpen(false)}>{t.ticket}</Link>
            <Link href="#contact" onClick={() => setOpen(false)}>{t.contact}</Link>

            {/* AUTH */}
            <div className="pt-2 flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/profil"
                    onClick={() => setOpen(false)}
                    className="py-2 rounded-md hover:bg-gray-100 hover:text-gray-800"
                  >
                    {t.editProfile}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    {t.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {t.login}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    {t.signup}
                  </Link>
                </>
              )}
            </div>

            {/* 🌍 Language Mobile */}
            <div className="border-t mt-3 pt-3 flex justify-center gap-4">
              <button
                onClick={() => handleChangeLanguage("id")}
                className={`px-3 py-1 rounded-md ${
                  language === "id"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                🇮🇩 ID
              </button>
              <button
                onClick={() => handleChangeLanguage("en")}
                className={`px-3 py-1 rounded-md ${
                  language === "en"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                🇬🇧 EN
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
