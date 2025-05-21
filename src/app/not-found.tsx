"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { HomeIcon, AlertTriangleIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="bg-primary/10 p-4 rounded-full mb-6">
          <AlertTriangleIcon className="h-16 w-16 text-primary" />
        </div>

        <h1 className="text-4xl font-bold mb-4">Team Not Found</h1>

        <p className="text-muted-foreground max-w-md mb-8">
          We couldn&apos;t find the team you&apos;re looking for. It may have been removed
          or you might have mistyped the address.
        </p>

        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">
              <HomeIcon className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>

          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </main>
    </div>
  );
}
