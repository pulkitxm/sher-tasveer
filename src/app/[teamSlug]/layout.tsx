import { teams } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function TeamPage({
  params,
  children,
}: {
  params: Promise<{ teamSlug: string }>;
  children: React.ReactNode;
}) {
  const { teamSlug } = await params;
  console.log(teamSlug);
  const team = teams.find((team) => team.slug === teamSlug);
  if (!team) return notFound();
  return children;
}
