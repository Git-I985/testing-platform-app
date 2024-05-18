import {sql} from "@vercel/postgres";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
    pages: {
        signIn: '/signin',
        signOut: '/signout',
    },
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            // @ts-ignore
            async authorize(credentials, req) {
                if (!credentials) {
                    return null
                }
                try {
                    const user = await sql`SELECT * FROM "user" WHERE email=${credentials.email} and password=${credentials.password}`
                    if (user.rows.length === 1) {
                        return user.rows[0]
                    }
                    return null
                } catch (e) {
                    console.log(`Query user error`, e)
                    return null
                }
            }
        })
    ],
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}