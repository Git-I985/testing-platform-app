import prisma from "@/app/prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestBody = await request.json();

  if (!requestBody.email || !requestBody.password) {
    return NextResponse.json(
      {
        error: "Одно из обязательных полей не заполнено",
      },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: requestBody.email,
      },
    });
    if (user) {
      return NextResponse.json(
        {
          error: "Пользователь с таким email уже существует",
        },
        { status: 400 },
      );
    }
  } catch (e) {
    console.log(`Check user exist error`, e);
    return NextResponse.json(
      {
        error: "Check user exist error",
      },
      { status: 500 },
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(requestBody.password, 10);
    await prisma.user.create({
      data: { email: requestBody.email, password: hashedPassword },
    });
  } catch (e) {
    console.log(`User creation error`, e);
    return NextResponse.json(
      {
        error: "User creation error",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({}, { status: 200 });
}