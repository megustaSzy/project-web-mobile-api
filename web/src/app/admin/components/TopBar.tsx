"use client";

import { Input } from "@/components/ui/input";
import { Search, Bell, Settings } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function TopBar() {
  return (
    <header className="flex items-center justify-between">
      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
        <Input placeholder="Search..." className="pl-8 w-64" />
      </div>

      {/* ICONS */}
      <div className="flex items-center gap-4">
        <Bell className="text-slate-500" />
        <Settings className="text-slate-500" />
        <Avatar>
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
