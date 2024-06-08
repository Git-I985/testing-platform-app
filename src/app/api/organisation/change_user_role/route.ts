import { getSessionUserData } from "@/app/api/getSessionUserData";
import {
  Forbidden,
  NotFound,
  Success,
  Unauthorized,
} from "@/app/api/responses";
import prisma from "@/app/prisma/client";

export const POST = async (request: Request) => {
  const { email, role: newRoleName } = await request.json();

  const { user } = await getSessionUserData();

  if (!user) {
    return Unauthorized();
  }

  if (!user.isAdmin) {
    return Forbidden();
  }

  const newRole = await prisma.role.findUnique({
    where: {
      name: newRoleName,
    },
  });

  if (!newRole) {
    return NotFound({
      error: `No role found with such name ${newRoleName}`,
    });
  }

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      roleId: newRole.id,
    },
  });

  return Success();
};