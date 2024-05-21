"use client";
import { useHandleAutoFill } from "@/app/components/Forms/useHandleAutoFill";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, Snackbar } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as React from "react";
import { Control, Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import * as Yup from "yup";

interface Form {
  name: string;
}

function NameField({ control }: { control: Control<Form> }) {
  const { inputHandleAutofillProps, inputLabelProps } = useHandleAutoFill();
  return (
    <Controller
      name={"name"}
      control={control}
      render={({ field: { ref, ...props }, fieldState: { error } }) => (
        <TextField
          margin="normal"
          label="Название организации"
          inputRef={ref}
          error={Boolean(error)}
          fullWidth
          size={"small"}
          helperText={error?.message}
          InputLabelProps={inputLabelProps}
          InputProps={inputHandleAutofillProps}
          {...props}
        />
      )}
    />
  );
}

enum SubmitState {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export function CreateOrgForm() {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(
      "Имя обязательно если оно уже было заполненно ранее",
    ),
  });
  const { mutate } = useSWRConfig();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [submitLoading, setSubmitButtonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState | null>(null);
  const { control, handleSubmit, formState } = useForm<Form>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    shouldFocusError: false,
    shouldUseNativeValidation: false,
    defaultValues: {
      name: "",
    },
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<Form> = async (data) => {
    setSubmitButtonLoading(true);
    fetch("/api/organisation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        setSnackbarOpen(true);
        if (res.status === 200 && res.ok) {
          setSubmitState(SubmitState.SUCCESS);
          mutate("/api/user");
          router.push("/");
        } else {
          setSubmitState(SubmitState.ERROR);
          res.json().then((res) => {
            if (res.error) {
              setError(res.error);
              console.error(res.error);
            } else {
              setError("Неизвестная ошибка, обратитесь в техподдержку");
            }
          });
        }
      })
      .catch((e) => {
        setSubmitState(SubmitState.ERROR);
        console.error(e);
        setError("Неизвестная ошибка, обратитесь в техподдержку");
      })
      .finally(() => setSubmitButtonLoading(false));
  };

  function handleClose(event?: React.SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  }

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={submitState === SubmitState.ERROR ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {submitState === SubmitState.ERROR ? error : "Организация создана"}
        </Alert>
      </Snackbar>
      <Typography mb={7} mt={5} variant={"h3"} color={"secondary.light"}>
        Создание организации
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        maxWidth={500}
      >
        <NameField control={control} />
        <LoadingButton
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={submitLoading}
          disabled={!formState.isValid}
        >
          Сохранить
        </LoadingButton>
      </Box>
    </>
  );
}