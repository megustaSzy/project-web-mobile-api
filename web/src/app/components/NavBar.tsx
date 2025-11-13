"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ name?: string; avatar?: string }>({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Cek token di localStorage dan ambil profil user dari API
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  setIsLoggedIn(true);

  // 🔹 Ambil data profil user
  fetch("http://10.93.86.50:3001/api/auth/login", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Gagal mengambil data profil");
      }
      return res.json();
    })
    .then((data) => {
      // 🔹 Pastikan path avatar benar
      const avatarUrl = data.avatar
        ? data.avatar.startsWith("http")
          ? data.avatar
          : `http://10.93.86.50:3001/uploads/${data.avatar}`
        : "/images/profile.jpg";

      setUserData({
        name: data.name || "User",
        avatar: avatarUrl,
      });
    })
    .catch((err) => {
      console.error("Gagal ambil profil:", err);
      setUserData({ name: "User", avatar: "/images/profile.jpg" });
    });
}, []);



  // 🔹 Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserData({});
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
        {/* Logo Kiri */}
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
        </div>

        {/* Navigation Tengah */}
        <nav
          className={`hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8 transition-colors duration-300 ${
            scrolled ? "text-gray-800" : "text-white"
          }`}
        >
          <Link href="/" className="hover:text-blue-500 transition">Home</Link>
          <Link href="#about" className="hover:text-blue-500 transition">About Us</Link>
          <Link href="#tours" className="hover:text-blue-500 transition">Tour List</Link>
          <Link href="#tickets" className="hover:text-blue-500 transition">My Ticket</Link>
          <Link href="#contact" className="hover:text-blue-500 transition">Contact</Link>
        </nav>

        {/* Tombol kanan */}
        <div className="hidden md:flex gap-3 ml-auto items-center relative">
          {isLoggedIn ? (
            <div className="relative group">
              <Image
                src={userData.avatar || "/images/profile.jpg"}
                alt="Profile"
                width={35}
                height={35}
                className="rounded-full border border-gray-300 cursor-pointer"
              />
              {/* Dropdown Profile */}
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                <Link
                  href="/Profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profil Saya
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className={`px-3 py-1 text-sm rounded-full border transition-colors duration-300 ${
                scrolled
                  ? "border-gray-700 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  : "border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600"
              }`}
            >
              Login
            </Link>
          )}
        </div>

        {/* Tombol Mobile Menu */}
        <button onClick={() => setOpen(!open)} className="md:hidden ml-auto p-2">
          {open ? (
            <X className={scrolled ? "text-gray-800" : "text-white"} />
          ) : (
            <Menu className={scrolled ? "text-gray-800" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className={`md:hidden border-t px-4 py-3 transition-all duration-300 ${
            scrolled
              ? "bg-white text-gray-800"
              : "bg-white/20 backdrop-blur-md text-white"
          }`}
        >
          <nav className="flex flex-col gap-3 text-center">
            <Link href="/">Home</Link>
            <Link href="#about">About Us</Link>
            <Link href="#tours">Tour List</Link>
            <Link href="#tickets">My Ticket</Link>
            <Link href="#contact">Contact</Link>
            <div className="pt-2 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link href="/Profile">Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login">Log In</Link>
                  <Link href="/register">Sign In</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
