// app/api/tenant/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { Prisma } from "@/lib/generated/prisma/client";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: auth.tenantId },
    select: {
      id: true,
      username: true,
      displayName: true,
      customDomain: true,
      isPublic: true,
    },
  });

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  return NextResponse.json(tenant);
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, displayName, customDomain, isPublic } = body;

    const tenant = await prisma.tenant.update({
      where: { id: auth.tenantId },
      data: {
        ...(username !== undefined && { username }),
        ...(displayName !== undefined && { displayName }),
        // Empty string means "clear the custom domain"
        ...(customDomain !== undefined && {
          customDomain: customDomain === "" ? null : customDomain,
        }),
        ...(isPublic !== undefined && { isPublic }),
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        customDomain: true,
        isPublic: true,
      },
    });

    return NextResponse.json(tenant);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = (error.meta?.target as string[]) || [];
      const field = target.includes("customDomain")
        ? "Custom domain"
        : "Username";
      return NextResponse.json(
        { error: `${field} is already taken.` },
        { status: 409 },
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
