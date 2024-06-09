import { getSessionUserData } from "@/app/api/getSessionUserData";
import {
  BadRequest,
  NotFound,
  ServerError,
  Success,
  Unauthorized,
} from "@/app/api/responses";
import prisma from "@/app/prisma/client";

export const POST = async (request: Request) => {
  const { user: currentUser } = await getSessionUserData();

  if (!currentUser) {
    return Unauthorized();
  }

  const { email } = await request.json();

  if (!email) {
    return BadRequest({
      error: "No email provided",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return NotFound({
      error: "No user found",
    });
  }

  if (user.organisationId) {
    return BadRequest({
      error: "User already in organisation",
    });
  }

  const role = await prisma.role.findUnique({
    where: {
      name: "USER",
    },
  });

  if (!role) {
    return ServerError({
      error: "Cannot find role USER to assign",
    });
  }

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      organisationId: currentUser?.organisationId,
      roleId: role.id,
    },
  });

  return Success();
};