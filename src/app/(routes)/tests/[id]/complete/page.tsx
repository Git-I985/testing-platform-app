import { TestCompleteForm } from "@/app/(routes)/tests/[id]/complete/TestCompleteForm";
import { getSessionUserData } from "@/app/api/getSessionUserData";
import prisma from "@/app/prisma/client";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import * as React from "react";

export default async function TestCompletePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { user } = await getSessionUserData();

  if (!user) {
    return redirect("/signin");
  }

  const test: any = await prisma.test.findUnique({
    where: {
      id: parseInt(id),
      completions: {
        none: {
          userId: {
            equals: parseInt(user.id),
          },
        },
      },
    },
  });

  if (!test) {
    redirect("/tests");
  }

  return (
    <>
      <Typography mb={3} mt={5} variant={"h3"} color={"secondary.light"}>
        {test.content.title}
      </Typography>
      <Typography mb={7} variant={"body1"} color={"secondary.light"}>
        Прохождение теста
      </Typography>
      <Typography mb={7} variant={"body1"} color={"secondary.light"}>
        {test.content.description}
      </Typography>
      <TestCompleteForm test={test} />
    </>
  );
}