"use client";
import { useHandleAutoFill } from "@/app/components/Forms/useHandleAutoFill";
import { validateEmail } from "@/app/components/Forms/validateEmail";
import { useOrganisation } from "@/app/WithOrganisation";
import { getUserRoleName, Role, useUser } from "@/app/WithUser";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
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
  useGridApiRef,
} from "@mui/x-data-grid";
import { User } from "@prisma/client";
import { useEffect } from "react";
import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { Control, Controller, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import * as Yup from "yup";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
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

  const handleCancelClick = (id: GridRowId) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    // console.log("handleCancelClick");
    // console.log(rows);
    // const editedRow = rows.find((row) => row.id === id);
    // if (editedRow!.isNew) {
    //   setRows(rows.filter((row) => row.id !== id));
    // }
  };

  return {
    rowModesModel,
    setRowModesModel,
    handleEditClick,
    handleSaveClick,
    handleRowModesModelChange,
    handleRowEditStop,
    handleCancelClick,
  };
}

interface Form {
  email: string;
}

function EmailField({ control }: { control: Control<Form> }) {
  const { inputHandleAutofillProps, inputLabelProps } = useHandleAutoFill();
  return (
    <Controller
      name={"email"}
      control={control}
      render={({ field: { ref, ...props }, fieldState: { error } }) => (
        <TextField
          margin="normal"
          label="Email"
          inputRef={ref}
          error={Boolean(error)}
          autoComplete="email"
          fullWidth
          size={"small"}
          sx={{ m: 0 }}
          helperText={error?.message}
          InputLabelProps={inputLabelProps}
          InputProps={inputHandleAutofillProps}
          {...props}
        />
      )}
    />
  );
}

export default function ManageOrganisationPage() {
  const { organisation } = useOrganisation();
  const { user } = useUser();
  const [rows, setRows] = React.useState<User[]>([]);
  const apiRef = useGridApiRef();
  const {
    rowModesModel,
    handleEditClick,
    setRowModesModel,
    handleRowModesModelChange,
    handleSaveClick,
    handleRowEditStop,
    handleCancelClick,
    // handleDeleteClick,
    // processRowUpdate,
  } = useEditableDatagrid();
  const { mutate } = useSWRConfig();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Поле email обязательно")
      .test("email", "Некорркетный email", validateEmail),
  });

  const { control, handleSubmit, watch, trigger, reset, formState } =
    useForm<Form>({
      mode: "onChange",
      resolver: yupResolver(validationSchema),
      shouldFocusError: false,
      shouldUseNativeValidation: false,
      defaultValues: {
        email: "",
      },
    });

  useEffect(() => {
    if (organisation?.users) {
      setRows(organisation.users.map((u) => ({ ...u, role: u.role.name })));
    }
  }, [organisation]);

  useEffect(() => {
    apiRef.current.autosizeColumns({
      includeHeaders: true,
      includeOutliers: true,
    });
  }, [rows]);

  const columns: GridColDef<User>[] = [
    {
      field: "name",
      headerName: "ФИО",
      editable: false,
      filterable: false,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      editable: false,
      filterable: false,
      flex: 1,
    },
    {
      field: "role",
      headerName: "Роль",
      type: "singleSelect",
      valueOptions: [
        { value: Role.ADMIN, label: getUserRoleName(Role.ADMIN) },
        { value: Role.USER, label: getUserRoleName(Role.USER) },
        { value: Role.MANAGER, label: getUserRoleName(Role.MANAGER) },
      ],
      editable: Boolean(user?.isAdmin),
      filterable: false,
      flex: 1,
    },
  ];

  if (user?.isAdmin) {
    columns.push({
      field: "actions",
      type: "actions",
      flex: 0.5,
      headerName: "",
      getActions: ({ id, row }: { id: GridRowId; row: GridRowModel<User> }) => {
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
              onClick={() => handleCancelClick(id)}
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
            onClick={() => fireUser(row.email)}
            color="inherit"
          />,
        ];
      },
    });
  }

  function fireUser(email: any) {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    };
    fetch("/api/organisation/fire", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        mutate("/api/organisation");
      })
      .catch((error) => console.error(error));
  }

  function inviteUser(data: Form) {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
      }),
    };
    fetch("/api/organisation/invite", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        mutate("/api/organisation");
      })
      .catch((error) => console.error(error));
  }

  function rowUpdate(newRow) {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        email: newRow.email,
        role: newRow.role,
      }),
    };
    fetch("/api/organisation/change_user_role", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        mutate("/api/organisation");
        mutate("/api/user");
      })
      .catch((error) => console.error(error));
    return newRow;
  }

  return (
    <>
      <Typography mb={7} mt={5} variant={"h3"} color={"secondary.light"}>
        Организация
      </Typography>
      <Box>
        <Typography mb={2} variant={"subtitle1"} alignContent={"center"}>
          Пользователи
        </Typography>
        {user?.isAdmin ? (
          <Grid
            container
            spacing={2}
            mb={2}
            alignItems={"stretch"}
            justifyContent={"end"}
          >
            <Grid item xs={12} lg={4} xl={3}>
              <EmailField control={control} />
            </Grid>
            <Grid item xs={12} lg={4} xl={3}>
              <Button
                variant={"contained"}
                color={"primary"}
                fullWidth
                onClick={handleSubmit(inviteUser)}
              >
                Пригласить пользователя
              </Button>
            </Grid>
          </Grid>
        ) : null}
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
          processRowUpdate={rowUpdate}
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