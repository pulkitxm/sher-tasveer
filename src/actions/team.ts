"use server";

import { prisma } from "@/db";

export async function getTeamWiseMetrics() {
  const teams = await prisma.team.findMany({
    select: {
      slug: true,
      count: true,
    },
  });
  return teams;
}

export async function incrementTeamCount(slug: string) {
  const team = await prisma.team.findUnique({
    where: {
      slug,
    },
  });
  if (!team) {
    await prisma.team.create({
      data: {
        slug,
        count: 1,
      },
    });
  } else {
    await prisma.team.update({
      where: {
        slug,
      },
      data: {
        count: team.count + 1,
      },
    });
  }
}
