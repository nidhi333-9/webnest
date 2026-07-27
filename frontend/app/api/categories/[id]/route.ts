import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { Prisma } from "@/lib/generated/prisma/client";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing || existing.tenantId !== auth.tenantId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 },
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });

    return NextResponse.json(category);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A category with this name already exists." },
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing || existing.tenantId !== auth.tenantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
