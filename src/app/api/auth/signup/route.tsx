import {sql} from "@vercel/postgres";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    const requestBody = await request.json()

    if (!requestBody.email || !requestBody.password) {
        return NextResponse.json({
            error: 'Одно из обязательных полей не заполнено'
        }, {status: 400})
    }

    try {
        const user = await sql`SELECT * FROM "user" WHERE email=${requestBody.email}`
        if (user.rows.length) {
            return NextResponse.json({
                error: 'Пользователь с таким email уже существует'
            }, {status: 400})
        }
    } catch (e) {
        console.log(`Check user exist error`, e)
        return NextResponse.json({
            error: 'Check user exist error'
        }, {status: 500})
    }

    try {
        await sql`INSERT INTO "user" ("email", "password") VALUES (${requestBody.email}, ${requestBody.password})`
    } catch (e) {
        console.log(`User creation error`, e)
        return NextResponse.json({
            error: 'User creation error'
        }, {status: 500})
    }

    return NextResponse.json({}, {status: 200})
}