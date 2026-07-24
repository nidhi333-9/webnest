// app/api/skills/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.skill.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  if (existing.tenantId !== auth.tenantId) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  await prisma.skill.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
