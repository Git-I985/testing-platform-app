import { getSessionUserData } from "@/app/api/getSessionUserData";
import {
  BadRequest,
  Forbidden,
  Success,
  Unauthorized,
} from "@/app/api/responses";
import prisma from "@/app/prisma/client";

export const POST = async (request: Request) => {
  const { email } = await request.json();

  if (!email) {
    return BadRequest({
      error: "No email provided",
    });
  }

  const { user } = await getSessionUserData();

  if (!user) {
    return Unauthorized();
  }

  if (!user.isAdmin) {
    return Forbidden();
  }

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      organisationId: null,
      roleId: null,
    },
  });

  return Success();
};