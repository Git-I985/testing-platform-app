"use client";

import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";

export function ResultsTable({ testCompletions }: { testCompletions: any }) {
  const columns: GridColDef[] = [
    {
      field: "user",
      headerName: "Пользователь",
      editable: false,
      minWidth: 300,
    },
    {
      field: "result",
      headerName: "Результат",
      editable: false,
    },
  ];

  const rows: GridRowModel[] = testCompletions.completions.map(
    (completion) => ({
      id: completion.id,
      user: completion?.user?.name || completion?.user?.email,
      result: `${completion?.results}/${testCompletions?.content?.questions?.reduce((acc, q) => acc + q.points, 0)}`,
    }),
  );

  return (
    <Box>
      <DataGrid
        rows={rows}
        columns={columns}
        sx={{
          mt: 4,
        }}
        disableColumnResize
        autosizeOnMount
        autosizeOptions={{
          includeOutliers: true,
          includeHeaders: true,
        }}
      />
    </Box>
  );
}