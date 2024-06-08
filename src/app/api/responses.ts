import { NextResponse } from "next/server";

export function NotFound(body = {}) {
  return NextResponse.json(body, { status: 404 });
}

export function BadRequest(body = {}) {
  return NextResponse.json(body, { status: 400 });
}

export function ServerError(body = {}) {
  return NextResponse.json(body, { status: 500 });
}

export function Unauthorized(body = {}) {
  return NextResponse.json(body, { status: 401 });
}

export function Forbidden(body = {}) {
  return NextResponse.json(body, { status: 403 });
}

export function Success(body = {}) {
  return NextResponse.json(body);
}