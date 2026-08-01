import { NextResponse } from "next/server";

interface SuccessBody<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

interface ErrorBody {
  success: false;
  message: string;
  errors?: Record<string, { code: string; message: string }>;
}

export function success<T>(message: string, data?: T, status = 200) {
  const body: SuccessBody<T> = { success: true, message };
  if (data !== undefined) body.data = data;
  return NextResponse.json(body, { status });
}

export function failure(message: string, status = 400, errors?: Record<string, { code: string; message: string }>) {
  const body: ErrorBody = { success: false, message };
  if (errors) body.errors = errors;
  return NextResponse.json(body, { status });
}
