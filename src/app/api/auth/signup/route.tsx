import { BadRequest, ServerError, Success } from "@/app/api/responses";
import prisma from "@/app/prisma/client";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const requestBody = await request.json();

  if (!requestBody.email || !requestBody.password) {
    return BadRequest({
      error: "Одно из обязательных полей не заполнено",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: requestBody.email,
      },
    });
    if (user) {
      return BadRequest({
        error: "Пользователь с таким email уже существует",
      });
    }
  } catch (e) {
    console.log(`Check user exist error`, e);
    return ServerError({
      error: "Check user exist error",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(requestBody.password, 10);
    await prisma.user.create({
      data: { email: requestBody.email, password: hashedPassword },
    });
  } catch (e) {
    console.log(`User creation error`, e);
    return ServerError({
      error: "User creation error",
    });
  }

  return Success();
}