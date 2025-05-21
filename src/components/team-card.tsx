import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Team } from "@/lib/types";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-4">
        <div
          className="flex items-center justify-center h-40 mb-4 rounded-md"
          style={{ backgroundColor: `${team.color}20` }} // Using team color with low opacity
        >
          <div className="relative w-24 h-24">
            <Image
              src={team.logo || "/placeholder.svg"}
              alt={`${team.name} logo`}
              fill
              className="object-contain"
            />
          </div>
        </div>
        <h3 className="font-semibold text-lg text-center">{team.name}</h3>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="outline" asChild>
          <Link href={`/${team.slug}`}>View Team</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
