"use client";
import { useOrganisation, useUser } from "@/app/WithUser";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridSlots,
  GridToolbarContainer,
  useGridApiRef,
} from "@mui/x-data-grid";
import { useEffect } from "react";
import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { randomId } from "@mui/x-data-grid-generator";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer sx={{ p: 2 }}>
      <Button
        color="primary"
        variant={"contained"}
        startIcon={<AddIcon />}
        onClick={handleClick}
        sx={{ ml: "auto" }}
      >
        Добавить
      </Button>
    </GridToolbarContainer>
  );
}

function useEditableDatagrid() {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  );
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleCancelClick = (id: GridRowId, setRows, rows) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    console.log("handleCancelClick");
    console.log(rows);
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleDeleteClick = (id: GridRowId, setRows, rows) => {
    // api call
    console.log("handleDeleteClick");
    console.log(rows);
    setRows(rows.filter((row) => row.id !== id));
  };

  const processRowUpdate = (newRow: GridRowModel, setRows, rows) => {
    const updatedRow = { ...newRow, isNew: false };
    // api call
    console.log("processRowUpdate");
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  return {
    rowModesModel,
    setRowModesModel,
    handleEditClick,
    handleSaveClick,
    handleRowModesModelChange,
    handleRowEditStop,
    handleCancelClick,
    handleDeleteClick,
    processRowUpdate,
  };
}

export default function ManageOrganisationPage() {
  const { organisation } = useOrganisation();
  const [rows, setRows] = React.useState([]);
  const apiRef = useGridApiRef();
  const {
    rowModesModel,
    handleEditClick,
    setRowModesModel,
    handleRowModesModelChange,
    handleSaveClick,
    handleRowEditStop,
    handleCancelClick,
    handleDeleteClick,
    processRowUpdate,
  } = useEditableDatagrid();

  useEffect(() => {
    apiRef.current.autosizeColumns({
      includeHeaders: true,
      includeOutliers: true,
    });
  }, [rows]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "ФИО",
      editable: true,
      filterable: false,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      editable: true,
      filterable: false,
      flex: 1,
    },
    {
      field: "role",
      headerName: "Роль",
      editable: true,
      filterable: false,
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      flex: 0.5,
      headerName: "",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={"save"}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={"cancel"}
              icon={<CancelIcon />}
              label="Cancel"
              onClick={() => handleCancelClick(id, setRows, rows)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={"edit"}
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={"delete"}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(id, setRows, rows)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Typography mb={7} mt={5} variant={"h3"} color={"secondary.light"}>
        Организация
      </Typography>
      <Box
        sx={{
          height: 500,
        }}
      >
        <DataGrid
          rows={rows}
          apiRef={apiRef}
          columns={columns}
          disableColumnResize
          autosizeOnMount
          autosizeOptions={{
            includeOutliers: true,
            includeHeaders: true,
          }}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={(newRow) => processRowUpdate(newRow, setRows, rows)}
          slots={{
            toolbar: EditToolbar as GridSlots["toolbar"],
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          mt: 7,
        }}
      >
        <Button
          variant={"outlined"}
          color={"error"}
          href={"/organisation/exit"}
        >
          Покинуть организацию
        </Button>
      </Box>
    </>
  );
}