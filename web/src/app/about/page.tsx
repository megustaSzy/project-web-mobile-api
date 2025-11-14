"use client";

import HeroSection from "../components/about/HeroSection";
import SejarahSection from "../components/about/SejarahSection";
import VisiMisiSection from "../components/about/VisiMisiSection";
import TeamSection from "../components/about/TeamSection";

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-black">
      <HeroSection />
      <SejarahSection />
      <VisiMisiSection />
      <TeamSection />
    </main>
  );
}