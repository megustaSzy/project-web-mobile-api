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

  // 🔹 Efek scroll (ubah warna navbar)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Ambil profil dari localStorage
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
        console.warn("Data profil lokal rusak");
      }
    } else {
      setUserData({ name: "User", avatar: "/images/profile.jpg" });
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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md border-b border-gray-200"
          : "bg-transparent border-b border-white/10"
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
        {/* 🔹 Logo */}
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
        </div>

        {/* 🔹 Menu Tengah (Desktop) */}
        <nav
          className={`hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8 transition-colors duration-300 ${
            scrolled ? "text-gray-800" : "text-white"
          }`}
        >
          <Link href="/" className="hover:text-blue-500">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-500">
            About Us
          </Link>
          <Link href="#tours" className="hover:text-blue-500">
            Tour List
          </Link>
          <Link href="#tickets" className="hover:text-blue-500">
            My Ticket
          </Link>
          <Link href="#contact" className="hover:text-blue-500">
            Contact
          </Link>
        </nav>

        {/* 🔹 Profil atau Login (Desktop) */}
        <div className="hidden md:flex gap-3 ml-auto items-center relative">
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
                {userData.name || "User"}
              </span>

              {/* 🔹 Dropdown */}
              <div className="absolute right-0 top-10 w-40 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                <Link
                  href="/profil"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Edit Profil
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
                  ? "border-gray-700 text-gray-700 hover:bg-blue-600 hover:text-white"
                  : "border-white text-white hover:bg-blue-600 hover:text-white"
              }`}
            >
              Login
            </Link>
          )}
        </div>

        {/* 🔹 Tombol Mobile Menu */}
        <button onClick={() => setOpen(!open)} className="md:hidden ml-auto p-2">
          {open ? (
            <X className={scrolled ? "text-gray-800" : "text-white"} />
          ) : (
            <Menu className={scrolled ? "text-gray-800" : "text-white"} />
          )}
        </button>
      </div>

      {/* 🔹 Mobile Menu — SUDAH DIPERBAIKI */}
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
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/about" onClick={() => setOpen(false)}>
              About Us
            </Link>
            <Link href="#tours" onClick={() => setOpen(false)}>
              Tour List
            </Link>
            <Link href="#tickets" onClick={() => setOpen(false)}>
              My Ticket
            </Link>
            <Link href="#contact" onClick={() => setOpen(false)}>
              Contact
            </Link>

            {/* Auth Buttons */}
            <div className="pt-2 flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/profil"
                    onClick={() => setOpen(false)}
                    className="py-2 rounded-md hover:bg-gray-100 hover:text-gray-800 transition"
                  >
                    Edit Profil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
