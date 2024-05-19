import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getSessionUser } from "@/app/api/user/getSessionUser";
import prisma from "@/app/prisma/client";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestBody = await request.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({}, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(session.user.id),
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Пользователя не существует" },
      { status: 404 },
    );
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
      NextResponse.json({});
    } else {
      return NextResponse.json(
        { error: "Пароли не совпадают" },
        { status: 400 },
      );
    }
  } else {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: requestBody,
    });
    NextResponse.json({});
  }

  return NextResponse.json(requestBody, { status: 200 });
}

export async function GET(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({}, { status: 404 });
  }

  const { password, ...userDetails } = user;

  return NextResponse.json(userDetails);
}