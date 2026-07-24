// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
export const dynamic = "force-dynamic";
export async function GET() {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { tenantId: auth.tenantId },
  });

  // A tenant may not have a profile yet — that's a valid state, not an error.
  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      bio,
      heroTitle,
      heroSubtitle,
      avatar,
      resumeUrl,
      location,
      emailPublic,
      showResume,
      theme,
    } = body;

    if (theme !== undefined && theme !== "LIGHT" && theme !== "DARK") {
      return NextResponse.json(
        { error: "Theme must be LIGHT or DARK" },
        { status: 400 },
      );
    }

    const data = {
      ...(bio !== undefined && { bio }),
      ...(heroTitle !== undefined && { heroTitle }),
      ...(heroSubtitle !== undefined && { heroSubtitle }),
      ...(avatar !== undefined && { avatar }),
      ...(resumeUrl !== undefined && { resumeUrl }),
      ...(location !== undefined && { location }),
      ...(emailPublic !== undefined && { emailPublic }),
      ...(showResume !== undefined && { showResume }),
      ...(theme !== undefined && { theme }),
    };

    // Profile is optional on Tenant, so PATCH doubles as "create on first save."
    const profile = await prisma.profile.upsert({
      where: { tenantId: auth.tenantId },
      update: data,
      create: { tenantId: auth.tenantId, ...data },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
