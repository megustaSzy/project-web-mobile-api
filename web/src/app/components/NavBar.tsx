"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md border-b border-gray-200"
          : "bg-transparent border-b border-white/10"
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
        {/* Logo (Kiri) */}
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
        </div>

        {/* Navigation (Tengah) */}
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

        {/* Tombol kanan (Log In / Sign In) */}
        <div className="hidden md:flex gap-3 ml-auto">
          <Link
          href="/auth/log in"
          className={`px-6 py-2 rounded-full border transition-colors duration-300 ${
            scrolled
              ? "border-gray-700 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600"
              : "border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600"
          }`}
        >
          Log In
        </Link>

        <Link
          href="/auth/register"
          className={`px-6 py-2 rounded-full border transition-colors duration-300 ${
            scrolled
              ? "border-gray-700 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600"
              : "border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600"
          }`}
        >
          Sign In
        </Link>
        </div>

        {/* Mobile Menu Button */}
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
              <Link href="/auth/login">Log In</Link>
              <Link href="/auth/register">Sign In</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
