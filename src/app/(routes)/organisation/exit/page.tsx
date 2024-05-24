import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/app/prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ExitOrganisation() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }

  await prisma.user.update({
    where: {
      id: parseInt(session.user.id),
    },
    data: {
      organisationId: null,
      roleId: null,
    },
  });

  redirect("/");
}