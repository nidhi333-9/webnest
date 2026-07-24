import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { Prisma } from "@/lib/generated/prisma/client";
import { resolveTechnology } from "../../../lib/resolveTechnology";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { tenantId: auth.tenantId },
    include: { technologies: { include: { technology: true } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      githubUrl,
      liveUrl,
      imageUrl,
      featured,
      technologies,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 },
      );
    }

    const project = await prisma.$transaction(async (tx) => {
      const techNames: string[] = Array.isArray(technologies)
        ? technologies.filter((t: unknown) => typeof t === "string" && t.trim())
        : [];

      const resolvedTechs = [];
      for (const raw of techNames) {
        resolvedTechs.push(await resolveTechnology(tx, raw));
      }

      return tx.project.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          githubUrl: githubUrl?.trim() || null,
          liveUrl: liveUrl?.trim() || null,
          imageUrl: imageUrl?.trim() || null,
          featured: Boolean(featured),
          tenantId: auth.tenantId,
          technologies: {
            create: resolvedTechs.map((t) => ({ technologyId: t.id })),
          },
        },
        include: { technologies: { include: { technology: true } } },
      });
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A conflicting record already exists." },
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
