import { getSessionUserData } from "@/app/api/getSessionUserData";
import { Forbidden, Success, Unauthorized } from "@/app/api/responses";
import prisma from "@/app/prisma/client";

export const DELETE = async (
  request: Request,
  { params: { id } }: { params: { id: string } },
) => {
  const { user } = await getSessionUserData();

  if (!user) {
    return Unauthorized();
  }

  if (!user.isAdmin && !user.isManager) {
    return Forbidden();
  }

  await prisma.test.delete({
    where: {
      id: parseInt(id),
    },
  });

  return Success();
};