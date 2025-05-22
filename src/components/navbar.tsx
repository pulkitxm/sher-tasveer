"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

import { ICON } from "@/assets/lion";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2 sm:px-6 sm:py-4">
      <div className="container flex h-16 items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <ICON />
          <span className="font-semibold text-lg">LionHUB</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
