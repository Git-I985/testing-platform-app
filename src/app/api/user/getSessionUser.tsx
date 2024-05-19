import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/app/prisma/client";
import { getServerSession } from "next-auth";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  const userId = session.user.id;

  return prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });
}