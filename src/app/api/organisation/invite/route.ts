import { getSessionUser } from "@/app/api/user/getSessionUser";
import prisma from "@/app/prisma/client";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { email } = await request.json();
  const currentUser = await getSessionUser();
  if (!email) {
    return NextResponse.json(
      {
        error: "No email provided",
      },
      { status: 400 },
    );
  }
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        error: "No user found",
      },
      { status: 404 },
    );
  }

  if (user.organisationId) {
    return NextResponse.json(
      {
        error: "User already in organisation",
      },
      { status: 400 },
    );
  }

  const role = await prisma.role.findUnique({
    where: {
      name: "USER",
    },
  });

  if (!role) {
    return NextResponse.json(
      {
        error: "Cannot assign role to user",
      },
      { status: 500 },
    );
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

  return NextResponse.json({});
};