"use client"
import {signIn} from "next-auth/react";
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useForm, SubmitHandler, Controller, Control} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {useState} from "react";

export const validateEmail = (value: string) =>
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value,
    );

export function useHandleAutoFill() {
    const [isAutoFill, setIsAutoFill] = useState(false);

    return {
        inputHandleAutofillProps: {
            onAnimationStart: (e: React.AnimationEvent<HTMLDivElement>) => {
                e.animationName === 'mui-auto-fill' && setIsAutoFill(true);
            },
            onAnimationEnd: (e: React.AnimationEvent<HTMLDivElement>) =>
                e.animationName === 'mui-auto-fill-cancel' && setIsAutoFill(false),
            onFocus: () => setIsAutoFill(false),
        },
        inputLabelProps: {
            shrink: isAutoFill || undefined,
        },
    };
}


function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            © Автоматизированная система тестирования
            {' '}
            {new Date().getFullYear()}
            .
        </Typography>
    );
}

const defaultTheme = createTheme();

interface Form {
    email: string
    password: string
}

function EmailField({control}: { control: Control<Form> }) {
    const {inputHandleAutofillProps, inputLabelProps} = useHandleAutoFill();
    return <Controller
        name={'email'}
        control={control}
        render={({field: {ref, ...props}, fieldState: {error}}) => (
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
}

function PasswordField({control}: { control: Control<Form> }) {
    const {inputHandleAutofillProps, inputLabelProps} = useHandleAutoFill();

    return <Controller
        name={'password'}
        control={control}
        render={({field: {ref, ...props}, fieldState: {error}}) => (
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
    />;
}

export function Form() {

    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Поле email обязательно').test('email', 'Некорркетный email', validateEmail),
        password: Yup.string().required('Пароль обязателен'),
    });


    const {control, handleSubmit, reset, setError, formState} = useForm<Form>({
        mode: 'onSubmit',
        resolver: yupResolver(validationSchema),
        shouldFocusError: false,
        shouldUseNativeValidation: false,
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<Form> = async (data) => {
        signIn("credentials", {
            email: data.email,
            password: data.password,
            callbackUrl: '/'
        });
    };


    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
            }}>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    {/*<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>*/}
                    {/*  <LockOutlinedIcon />*/}
                    {/*</Avatar>*/}
                    <Typography component="h1" variant="h5">
                        Вход
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                        <EmailField control={control}/>
                        <PasswordField control={control}/>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Войти
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Забыли пароль?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Регистрация"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
}