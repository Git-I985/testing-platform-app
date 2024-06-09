import { Question, QuestionType } from "@/app/(routes)/tests/create/types";
import { getSessionUserData } from "@/app/api/getSessionUserData";
import { BadRequest, Success, Unauthorized } from "@/app/api/responses";
import prisma from "@/app/prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";

export const POST = async (
  request: Request,
  { params: { id } }: { params: { id: string } },
) => {
  const { user } = await getSessionUserData();

  if (!user) {
    return Unauthorized();
  }

  const answers = await request.json();

  const test = await prisma.test.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!test?.content) {
    return BadRequest();
  }

  let points = 0;

  ((test.content as JsonObject).questions as Question[]).forEach((q) => {
    if (
      (q.type === QuestionType.text || q.type === QuestionType.single) &&
      q.answer === answers[q.id]
    ) {
      points += q.points;
    }
  });

  await prisma.testCompletion.create({
    data: {
      userId: parseInt(user.id),
      testId: parseInt(id),
      results: points.toString(),
    },
  });

  return Success();
};