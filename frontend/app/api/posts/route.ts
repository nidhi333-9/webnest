import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { Prisma } from "@/lib/generated/prisma/client";
import { resolveTag } from "@/lib/resolveTag";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    where: { tenantId: auth.tenantId },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
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
      slug,
      content,
      excerpt,
      coverImage,
      published,
      categoryId,
      tags,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 },
      );
    }

    if (categoryId !== undefined && categoryId !== null) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category || category.tenantId !== auth.tenantId) {
        return NextResponse.json(
          { error: "Invalid category" },
          { status: 400 },
        );
      }
    }

    const post = await prisma.$transaction(async (tx) => {
      const tagNames: string[] = Array.isArray(tags)
        ? tags.filter((t: unknown) => typeof t === "string" && t.trim())
        : [];

      const resolvedTags = [];
      for (const raw of tagNames) {
        resolvedTags.push(await resolveTag(tx, raw));
      }

      return tx.post.create({
        data: {
          title,
          slug,
          content,
          excerpt,
          coverImage: coverImage ?? null,
          published: published ?? false,
          publishedAt: published ? new Date() : null,
          tenantId: auth.tenantId,
          categoryId: categoryId ?? null,
          tags: {
            create: resolvedTags.map((t) => ({ tagId: t.id })),
          },
        },
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
      });
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Slug already exists." },
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
