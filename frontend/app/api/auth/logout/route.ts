import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    await prisma.session.delete({ where: { token } }).catch(() => {});
  }

  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.delete("token");

  return response;
}
