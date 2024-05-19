"use client";
import { CentralFormLayout } from "@/app/components/Forms/CentralFormLayout";
import { useHandleAutoFill } from "@/app/components/Forms/useHandleAutoFill";
import { validateEmail } from "@/app/components/Forms/validateEmail";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import * as React from "react";
import { Control, Controller, SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import NextLink from "next/link";

interface Form {
  email: string;
  password: string;
  confirm: string;
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
          autoComplete="new-password"
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

function ConfirmPasswordField({ control }: { control: Control<Form> }) {
  const { inputHandleAutofillProps, inputLabelProps } = useHandleAutoFill();

  return (
    <Controller
      name={"confirm"}
      control={control}
      render={({ field: { ref, ...props }, fieldState: { error } }) => (
        <TextField
          margin="normal"
          label="Подтвердите пароль"
          required
          inputRef={ref}
          error={Boolean(error)}
          autoComplete="new-password"
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

export function Form() {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Поле email обязательно")
      .test("email", "Некорркетный email", validateEmail),
    password: Yup.string()
      .required("Поле пароль обязателено")
      .min(8, "Минимальная длина пароля - 8 знаков"),
    confirm: Yup.string()
      .required("Подтвердите пароль")
      .oneOf([Yup.ref("password")], "Пароли должны совпадать"),
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  watch(() => setError(null));

  const onSubmit: SubmitHandler<Form> = async (data) => {
    setLoading(true);
    fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })
      .then((res) => {
        if (res.status === 200 && res.ok) {
          signIn("credentials", {
            email: data.email,
            password: data.password,
            callbackUrl: "/",
          });
        } else {
          setLoading(false);
          res.json().then((res) => {
            if (res && res.error) {
              setError(res.error);
            } else {
              setError(
                "Ошибка регистрации, пожалуйста обратитесь в техподдержку",
              );
            }
          });
        }
      })
      .catch((e) => {
        setLoading(false);
        setError("Ошибка регистрации, пожалуйста обратитесь в техподдержку");
      });
  };

  return (
    <CentralFormLayout title={"Регистрация"} onSubmit={handleSubmit(onSubmit)}>
      <EmailField control={control} />
      <PasswordField control={control} />
      <ConfirmPasswordField control={control} />
      {error ? (
        <Typography variant="body2" color={"error.main"}>
          {error}
        </Typography>
      ) : null}
      <LoadingButton
        type="submit"
        fullWidth
        variant="contained"
        loading={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        Зарегистрироваться
      </LoadingButton>
      <Link component={NextLink} href="/signin" variant="body2">
        {"Вход"}
      </Link>
    </CentralFormLayout>
  );
}