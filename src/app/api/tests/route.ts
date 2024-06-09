import { getSessionUserData } from "@/app/api/getSessionUserData";
import { Forbidden, Success, Unauthorized } from "@/app/api/responses";
import prisma from "@/app/prisma/client";

export const GET = async (request: Request) => {
  const { user } = await getSessionUserData();

  if (!user) {
    return Unauthorized();
  }

  const tests = await prisma.test.findMany({
    include: {
      completions: {
        where: {
          user: {
            id: parseInt(user.id),
          },
        },
      },
    },
    where: {
      OR: [
        { creatorId: parseInt(user.id) },
        { users: { some: { id: parseInt(user.id) } } },
        {
          completions: {
            some: {
              user: {
                id: parseInt(user.id),
              },
            },
          },
        },
      ],
    },
  });

  return Success(tests);
};

export const POST = async (request: Request) => {
  const { users: usersEmails, ...body } = await request.json();
  const { user } = await getSessionUserData();

  if (!user) {
    return Unauthorized();
  }

  if (!user.isManager && !user.isAdmin) {
    return Forbidden();
  }

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: usersEmails,
      },
    },
  });

  await prisma.test.create({
    data: {
      users: {
        connect: users.map((u) => ({ id: u.id })),
      },
      content: body,
      creatorId: parseInt(user.id),
    },
  });

  return Success();
};