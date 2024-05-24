"use client";
import { CentralFormLayout } from "@/app/components/Forms/CentralFormLayout";
import { useHandleAutoFill } from "@/app/components/Forms/useHandleAutoFill";
import { validateEmail } from "@/app/components/Forms/validateEmail";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as React from "react";
import { Control, Controller, SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

interface Form {
  email: string;
  password: string;
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
          required
          inputRef={ref}
          error={Boolean(error)}
          autoComplete="email"
          fullWidth
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

function PasswordField({ control }: { control: Control<Form> }) {
  const { inputHandleAutofillProps, inputLabelProps } = useHandleAutoFill();

  return (
    <Controller
      name={"password"}
      control={control}
      render={({ field: { ref, ...props }, fieldState: { error } }) => (
        <TextField
          margin="normal"
          label="Пароль"
          required
          inputRef={ref}
          error={Boolean(error)}
          fullWidth
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

const errorsMap: Record<string, string> = {
  CredentialsSignin: "Неверные данные",
  default: "Произошла ошибка, пожалуйста обратитесь в техподдержку",
};

export function Form() {
  const searchParamsError = useSearchParams().get("error");
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Поле email обязательно")
      .test("email", "Некорркетный email", validateEmail),
    password: Yup.string().required("Пароль обязателен"),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParamsError
      ? errorsMap[searchParamsError] || errorsMap["default"]
      : null,
  );

  const { control, handleSubmit, watch } = useForm<Form>({
    mode: "onSubmit",
    resolver: yupResolver(validationSchema),
    shouldFocusError: false,
    shouldUseNativeValidation: false,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  watch(() => {
    setError(null);
  });

  const onSubmit: SubmitHandler<Form> = async (data) => {
    setLoading(true);
    signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/",
    });
  };

  return (
    <CentralFormLayout title={"Вход"} onSubmit={handleSubmit(onSubmit)}>
      <EmailField control={control} />
      <PasswordField control={control} />
      {error ? (
        <Typography variant="body2" color={"error.main"}>
          {error}
        </Typography>
      ) : null}
      <LoadingButton
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        loading={loading}
      >
        Войти
      </LoadingButton>
      <Grid container>
        <Grid item xs>
          <Link href="/signup" variant="body2">
            {"Регистрация"}
          </Link>
        </Grid>
        <Grid item>
          <Link href="#" variant="body2">
            Забыли пароль?
          </Link>
        </Grid>
      </Grid>
    </CentralFormLayout>
  );
}