import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NotFound, Success, Unauthorized } from "@/app/api/responses";
import { getSessionUser } from "@/app/api/user/getSessionUser";
import prisma from "@/app/prisma/client";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  const requestBody = await request.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Unauthorized();
  }

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(session.user.id),
    },
  });

  if (!user) {
    return NotFound({ error: "Пользователя не существует" });
  }

  if (requestBody.newPassword) {
    const passwordsMatch = await bcrypt.compare(
      requestBody.oldPassword,
      user.password,
    );

    if (passwordsMatch) {
      const newPasswordEncrypted = await bcrypt.hash(
        requestBody.newPassword,
        10,
      );
      const { newPassword, oldPassword, ...newUser } = requestBody;
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ...newUser,
          password: newPasswordEncrypted,
        },
      });
      return Success();
    } else {
      return Unauthorized({ error: "Пароли не совпадают" });
    }
  } else {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: requestBody,
    });
    return Success();
  }
}

export async function GET(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return Unauthorized();
  }

  const { password, ...userDetails } = user;

  return Success(userDetails);
}