import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getSessionUser } from "@/app/api/user/getSessionUser";
import prisma from "@/app/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Сессия не найдена" }, { status: 404 });
  }

  const queryResult = await prisma.user.findUnique({
    where: {
      id: parseInt(session.user.id),
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
    return NextResponse.json(
      { error: "Пользователь не состоит в организации" },
      { status: 404 },
    );
  }

  return NextResponse.json(queryResult.organisation);
}

export async function POST(request: Request) {
  const requestBody = await request.json();
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json(
      { error: "Пользователя не существует" },
      { status: 404 },
    );
  }

  if (user.organisationId) {
    return NextResponse.json(
      { error: "Пользователь уже состоит в организации" },
      { status: 403 },
    );
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
    return NextResponse.json(
      { error: "Неудается назначить роль администратора пользователю" },
      { status: 404 },
    );
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      organisationId: organisation.id,
      roleId: adminRole.id,
    },
  });

  return NextResponse.json({});
}