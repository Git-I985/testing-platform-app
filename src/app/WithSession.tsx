"use client"
import {SessionProvider} from "next-auth/react";
import * as React from "react";
import {PropsWithChildren} from "react";

export function WithSession({session, children}: PropsWithChildren<{ session: any }>) {
    return <SessionProvider session={session}>
        {children}
    </SessionProvider>
}