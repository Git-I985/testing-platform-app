import {Copyright} from "@/app/components/Forms/Copyright";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {FormEventHandler, PropsWithChildren} from "react";


export function CentralFormLayout({children, title, onSubmit}: PropsWithChildren<{
    title: string,
    onSubmit: FormEventHandler
}>) {
    return <Container component="main" maxWidth="xs" sx={{
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
        ><Typography component="h1" variant="h5">
            {title}
        </Typography>
            <Box component="form" onSubmit={onSubmit} noValidate sx={{mt: 1}}>{children}</Box>
        </Box>
        <Copyright sx={{mt: 8, mb: 4}}/>
    </Container>
}