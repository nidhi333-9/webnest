// app/api/social-links/route.ts
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
export const dynamic = "force-dynamic";
export async function GET() {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const socialLinks = await prisma.socialLink.findMany({
    where: { tenantId: auth.tenantId },
    orderBy: { platform: "asc" },
  });

  return NextResponse.json(socialLinks);
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log(body);
    const { platform, url } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { error: "Platform and url are required" },
        { status: 400 },
      );
    }

    if (!VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json(
        { error: `Platform must be one of: ${VALID_PLATFORMS.join(", ")}` },
        { status: 400 },
      );
    }

    const socialLink = await prisma.socialLink.create({
      data: {
        platform,
        url,
        tenantId: auth.tenantId,
      },
    });

    return NextResponse.json(socialLink, { status: 201 });
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
