"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm p-4 hidden md:flex flex-col">
      <h1 className="text-xl font-semibold mb-6">Studio Admin</h1>

      <Button className="w-full mb-4">+ Quick Create</Button>

      <div className="flex flex-col gap-1 text-sm">
        <span className="text-xs font-semibold text-slate-500 px-2">Dashboards</span>
        <Button variant="ghost" className="justify-start">Default</Button>
        <Button variant="ghost" className="justify-start">CRM</Button>
        <Button variant="ghost" className="justify-start">Finance</Button>
      </div>

      <div className="mt-auto pt-4">
        <div className="flex items-center gap-3 p-2 border rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">Arhan Khan</p>
            <p className="text-xs text-slate-500">hello@arhankhz.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
