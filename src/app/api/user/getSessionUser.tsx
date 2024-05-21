import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/app/prisma/client";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function getSessionUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    include: {
      role: true,
      organisation: true,
    },
  });

  if (!user) {
    return null;
  }

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword as unknown as User;
}