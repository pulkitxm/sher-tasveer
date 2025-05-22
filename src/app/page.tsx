"use client";

import { teams } from "@/lib/data";
import { TeamCard } from "@/components/team-card";
import { Navbar } from "@/components/navbar";
import { getTeamWiseMetrics } from "@/actions/team";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [teamsWithMetrics, setTeamsWithMetrics] = useState(
    teams.map((team) => ({
      ...team,
      count: 0,
    })),
  );

  const sortedTeams = useMemo(
    () => teamsWithMetrics.sort((a, b) => b.count - a.count),
    [teamsWithMetrics],
  );

  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const metrics = await getTeamWiseMetrics();

      setTeamsWithMetrics(
        teams.map((team) => ({
          ...team,
          count: metrics.find((m) => m.slug === team.slug)?.count || 0,
        })),
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    const intervalId = setInterval(() => {
      fetchMetrics();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
          Cricket Teams
          {isLoading && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              (Loading...)
            </span>
          )}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedTeams.map((team, index) => (
            <TeamCard key={index} count={team.count} team={team} />
          ))}
        </div>
      </main>
    </div>
  );
}
