import { getSessionUserData } from "@/app/api/getSessionUserData";
import {
  BadRequest,
  ServerError,
  Success,
  Unauthorized,
} from "@/app/api/responses";
import prisma from "@/app/prisma/client";

export async function GET(request: Request) {
  const { user } = await getSessionUserData();

  if (!user) {
    return Unauthorized();
  }

  const queryResult = await prisma.user.findUnique({
    where: {
      id: Number(user.id),
    },
    select: {
      organisation: {
        select: {
          id: true,
          name: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
  });

  if (!queryResult || !queryResult.organisation) {
    return BadRequest({ error: "Пользователь не состоит в организации" });
  }

  return Success(queryResult.organisation);
}

export async function POST(request: Request) {
  const requestBody = await request.json();
  const { user } = await getSessionUserData();

  if (!user) {
    return Unauthorized();
  }

  if (user.organisationId) {
    return BadRequest({ error: "Пользователь уже состоит в организации" });
  }

  const organisation = await prisma.organisation.create({
    data: {
      name: requestBody.name,
    },
  });

  const adminRole = await prisma.role.findUnique({
    where: {
      name: "ADMIN",
    },
  });

  if (!adminRole) {
    return ServerError({
      error: "Неудается назначить роль администратора пользователю",
    });
  }

  await prisma.user.update({
    where: {
      id: Number(user.id),
    },
    data: {
      organisationId: organisation.id,
      roleId: adminRole.id,
    },
  });

  return Success();
}