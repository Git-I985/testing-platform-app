"use client";
import { useHandleAutoFill } from "@/app/components/Forms/useHandleAutoFill";
import { validateEmail } from "@/app/components/Forms/validateEmail";
import { useUser } from "@/app/WithUser";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, Snackbar } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import * as React from "react";
import { Control, Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import * as Yup from "yup";

interface Form {
  email: string;
  name?: string | undefined;
  oldPassword?: string;
  newPassword?: string;
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
          autoFocus
          helperText={error?.message}
          InputLabelProps={inputLabelProps}
          InputProps={inputHandleAutofillProps}
          {...props}
        />
      )}
    />
  );
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
          label="ФИО"
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

function OldPasswordField({ control }: { control: Control<Form> }) {
  const { inputHandleAutofillProps, inputLabelProps } = useHandleAutoFill();

  return (
    <Controller
      name={"oldPassword"}
      control={control}
      render={({ field: { ref, ...props }, fieldState: { error } }) => (
        <TextField
          margin="normal"
          label="Старый пароль"
          inputRef={ref}
          error={Boolean(error)}
          fullWidth
          size={"small"}
          type="password"
          helperText={error?.message}
          InputLabelProps={inputLabelProps}
          InputProps={inputHandleAutofillProps}
          {...props}
        />
      )}
    />
  );
}

function NewPasswordField({ control }: { control: Control<Form> }) {
  const { inputHandleAutofillProps, inputLabelProps } = useHandleAutoFill();
  return (
    <Controller
      name={"newPassword"}
      control={control}
      render={({ field: { ref, ...props }, fieldState: { error } }) => (
        <TextField
          margin="normal"
          label="Новый пароль"
          inputRef={ref}
          error={Boolean(error)}
          fullWidth
          size={"small"}
          type="password"
          helperText={error?.message}
          InputLabelProps={inputLabelProps}
          InputProps={inputHandleAutofillProps}
          {...props}
        />
      )}
    />
  );
}

export function EditProfileForm() {
  const { mutate } = useSWRConfig();
  const { user } = useUser();
  const validationSchema = Yup.object().shape(
    {
      email: Yup.string()
        .required("Поле email обязательно")
        .test("email", "Некорркетный email", validateEmail),
      name: user.name
        ? Yup.string().required(
            "Имя обязательно если оно уже было заполненно ранее",
          )
        : Yup.string(),
      oldPassword: Yup.string().when("newPassword", {
        is: (newPassword: any) => !Boolean(newPassword),
        then: (schema) => schema.notRequired().optional().nullable(),
        otherwise: (schema) =>
          schema.required("Для смены пароля необходимо указать старый пароль"),
      }),
      newPassword: Yup.string().when("oldPassword", {
        is: (oldPassword: any) => !Boolean(oldPassword),
        then: (schema) => schema.notRequired().optional().nullable(),
        otherwise: (schema) =>
          schema
            .required("Для смены пароля необходимо указать новый пароль")
            .min(8, "Минимальная длина пароля - 8 знаков"),
      }),
    },
    [
      ["oldPassword", "newPassword"],
      ["newPassword", "oldPassword"],
    ],
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, watch, trigger, reset, formState } =
    useForm<Form>({
      mode: "onChange",
      resolver: yupResolver(validationSchema),
      shouldFocusError: false,
      shouldUseNativeValidation: false,
      defaultValues: {
        email: user.email,
        name: user.name || "",
        newPassword: "",
        oldPassword: "",
      },
    });

  useEffect(() => {
    const sub = watch((_, event) => {
      setError(null);
    });
    return () => sub.unsubscribe();
  }, [watch, trigger]);

  const onSubmit: SubmitHandler<Form> = async (data) => {
    setSubmitLoading(true);

    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        Object.fromEntries(Object.entries(data).filter(([k, v]) => v)),
      ),
    })
      .then((res) => {
        if (res.status === 200 && res.ok) {
          setSnackbarOpen(true);
          mutate("/api/user");
        } else {
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
        setError("Неизвестная ошибка, обратитесь в техподдержку");
        console.error(e);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  function handleClose(event?: React.SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      maxWidth={500}
      sx={{
        marginTop: 5,
      }}
    >
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
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
            Данные пользователя обновлены
          </Alert>
        </Snackbar>
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={2000}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
        <EmailField control={control} />
        <NameField control={control} />
        <OldPasswordField control={control} />
        <NewPasswordField control={control} />
        <LoadingButton
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={submitLoading}
          disabled={!formState.isValid}
        >
          Сохранить
        </LoadingButton>
      </>
    </Box>
  );
}