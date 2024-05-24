import { getSessionUser } from "@/app/api/user/getSessionUser";
import prisma from "@/app/prisma/client";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json(
      {
        error: "No email provided",
      },
      { status: 400 },
    );
  }

  const currentUser = await getSessionUser();

  if (currentUser?.role?.name !== "ADMIN") {
    return NextResponse.json(
      {
        error: "Forbidden",
      },
      { status: 403 },
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

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      organisationId: null,
      roleId: null,
    },
  });

  return NextResponse.json({});
};