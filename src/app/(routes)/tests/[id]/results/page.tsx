import { ResultsTable } from "@/app/(routes)/tests/[id]/results/ResultsTable";
import { getSessionUserData } from "@/app/api/getSessionUserData";
import prisma from "@/app/prisma/client";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import * as React from "react";

export default async function TestResultsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { user } = await getSessionUserData();

  if (!user) {
    return redirect("/signin");
  }

  if (!user.isAdmin && !user.isManager) {
    redirect("/");
  }

  const testCompletions: any = await prisma.test.findUnique({
    include: {
      completions: {
        include: {
          user: true,
        },
      },
    },
    where: {
      id: parseInt(id),
    },
  });

  if (!testCompletions) {
    redirect("/tests");
  }

  return (
    <>
      <Typography mb={3} mt={5} variant={"h3"} color={"secondary.light"}>
        {testCompletions.content.title}
      </Typography>
      <Typography mb={7} variant={"body1"} color={"secondary.light"}>
        Результаты теста
      </Typography>
      <ResultsTable testCompletions={testCompletions} />
    </>
  );
}