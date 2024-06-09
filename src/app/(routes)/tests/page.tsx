"use client";
import { fetcher } from "@/app/fetcher";
import { useUser } from "@/app/WithUser";
import { Construction, Done, PendingActions } from "@mui/icons-material";
import { Stack, Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function TestsPage() {
  const [selectedTab, setSelectedTab] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };
  const { user } = useUser();
  const { data: allTests } = useSWR("/api/tests", fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
  });
  const router = useRouter();

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Название",
      editable: false,
    },
    {
      field: "description",
      headerName: "Описание",
      editable: false,
    },
    selectedTab === "1" && {
      field: "results",
      headerName: "Результат",
      editable: false,
    },
  ].filter(Boolean) as GridColDef[];

  const rows = (
    allTests?.map((test: any) => ({
      title: test.content.title,
      description: test.content.description,
      results: test.completions.length
        ? `${test.completions[0].results}/${test.content.questions.reduce((acc, q) => acc + q.points, 0)}`
        : "--/--",
      ...test,
    })) || []
  ).filter((testRow: any) => {
    if (selectedTab === "1") {
      return testRow.completions.length;
    } else if (selectedTab === "2") {
      return !testRow.completions.length;
    } else {
      return user?.id === testRow.creatorId;
    }
  });

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography mb={7} mt={5} variant={"h3"} color={"secondary.light"}>
          Тесты
        </Typography>
        {user?.isAdmin || user?.isManager ? (
          <Button href={"/tests/create"} component={Link} variant={"contained"}>
            Создать тест
          </Button>
        ) : null}
      </Stack>
      <Tabs value={selectedTab} onChange={handleChange} variant={"fullWidth"}>
        <Tab
          sx={{
            fontWeight: 600,
          }}
          label="Пройденные"
          icon={<Done />}
          iconPosition={"start"}
          value="1"
        />
        <Tab
          sx={{
            fontWeight: 600,
          }}
          icon={<PendingActions />}
          iconPosition={"start"}
          label="К прохождению"
          value="2"
        />
        {user?.isManager || user?.isAdmin ? (
          <Tab
            sx={{
              fontWeight: 600,
            }}
            icon={<Construction />}
            iconPosition={"start"}
            label="Созданные"
            value="3"
          />
        ) : null}
      </Tabs>
      <Box>
        {!rows.length ? null : (
          <DataGrid
            rows={rows}
            columns={columns}
            sx={{
              mt: 4,
            }}
            disableColumnResize
            autosizeOnMount
            onRowClick={(params) => {
              if (selectedTab === "2") {
                router.push(`/tests/${params.row.id}/complete`);
              }
              if (selectedTab === "3") {
                router.push(`/tests/${params.row.id}/results`);
              }
            }}
            autosizeOptions={{
              includeOutliers: true,
              includeHeaders: true,
            }}
          />
        )}
      </Box>
    </>
  );
}