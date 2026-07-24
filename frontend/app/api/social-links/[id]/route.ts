// app/api/social-links/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { Prisma } from "@/lib/generated/prisma/client";

const VALID_PLATFORMS = [
  "GITHUB",
  "LINKEDIN",
  "TWITTER",
  "YOUTUBE",
  "INSTAGRAM",
  "PORTFOLIO",
];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const socialLink = await prisma.socialLink.findUnique({ where: { id } });

  if (!socialLink) {
    return NextResponse.json(
      { error: "Social link not found" },
      { status: 404 },
    );
  }

  if (socialLink.tenantId !== auth.tenantId) {
    return NextResponse.json(
      { error: "Social link not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(socialLink);
}

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

    const existing = await prisma.socialLink.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "Social link not found" },
        { status: 404 },
      );
    }

    if (existing.tenantId !== auth.tenantId) {
      return NextResponse.json(
        { error: "Social link not found" },
        { status: 404 },
      );
    }

    const body = await req.json();
    const { platform, url } = body;

    if (platform !== undefined && !VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json(
        { error: `Platform must be one of: ${VALID_PLATFORMS.join(", ")}` },
        { status: 400 },
      );
    }

    const socialLink = await prisma.socialLink.update({
      where: { id },
      data: {
        ...(platform !== undefined && { platform }),
        ...(url !== undefined && { url }),
      },
    });

    return NextResponse.json(socialLink);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A link for this platform already exists." },
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.socialLink.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json(
      { error: "Social link not found" },
      { status: 404 },
    );
  }

  if (existing.tenantId !== auth.tenantId) {
    return NextResponse.json(
      { error: "Social link not found" },
      { status: 404 },
    );
  }

  await prisma.socialLink.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
