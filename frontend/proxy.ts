import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "./lib/prisma";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const session = await prisma.session.findFirst({
    where: { token },
  });

  const isExpired = !session || session.expiresAt < new Date();
  if (isExpired) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
