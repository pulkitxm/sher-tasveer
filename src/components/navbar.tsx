"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { BirdIcon as Cricket } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2 sm:px-6 sm:py-4">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Cricket className="h-6 w-6" />
          <span className="font-semibold text-lg">Vote Cricketers</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
