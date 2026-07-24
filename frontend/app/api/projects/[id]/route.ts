import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { Prisma } from "@/lib/generated/prisma/client";
import { resolveTechnology } from "@/lib/resolveTechnology";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { technologies: { include: { technology: true } } },
  });

  if (!project || project.tenantId !== auth.tenantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.project.findUnique({
      where: { id: params.id },
    });
    if (!existing || existing.tenantId !== auth.tenantId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
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

    if (title !== undefined && !title.trim()) {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 },
      );
    }
    if (description !== undefined && !description.trim()) {
      return NextResponse.json(
        { error: "Description cannot be empty" },
        { status: 400 },
      );
    }

    const scalarData: Prisma.ProjectUpdateInput = {};
    if (title !== undefined) scalarData.title = title.trim();
    if (description !== undefined) scalarData.description = description.trim();
    if (githubUrl !== undefined)
      scalarData.githubUrl = githubUrl?.trim() || null;
    if (liveUrl !== undefined) scalarData.liveUrl = liveUrl?.trim() || null;
    if (imageUrl !== undefined) scalarData.imageUrl = imageUrl?.trim() || null;
    if (featured !== undefined) scalarData.featured = Boolean(featured);

    const project = await prisma.$transaction(async (tx) => {
      if (Object.keys(scalarData).length > 0) {
        await tx.project.update({ where: { id: params.id }, data: scalarData });
      }

      if (technologies !== undefined) {
        const techNames: string[] = Array.isArray(technologies)
          ? technologies.filter(
              (t: unknown) => typeof t === "string" && t.trim(),
            )
          : [];

        const resolvedTechs = [];
        for (const raw of techNames) {
          resolvedTechs.push(await resolveTechnology(tx, raw));
        }
        const techIds = resolvedTechs.map((t) => t.id);

        // Drop links no longer wanted
        await tx.projectTechnology.deleteMany({
          where: { projectId: params.id, technologyId: { notIn: techIds } },
        });

        // Add/keep the rest
        for (const technologyId of techIds) {
          await tx.projectTechnology.upsert({
            where: {
              projectId_technologyId: { projectId: params.id, technologyId },
            },
            create: { projectId: params.id, technologyId },
            update: {},
          });
        }
      }

      return tx.project.findUnique({
        where: { id: params.id },
        include: { technologies: { include: { technology: true } } },
      });
    });

    return NextResponse.json(project);
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.project.findUnique({
    where: { id: params.id },
  });
  if (!existing || existing.tenantId !== auth.tenantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ProjectTechnology rows cascade automatically; orphaned Technology
  // rows are left in place, same as Tag/Category orphans elsewhere.
  await prisma.project.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
