import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { Prisma } from "@/lib/generated/prisma/client";
import { resolveTag } from "@/lib/resolveTag";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post || post.tenantId !== auth.tenantId) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
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

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.tenantId !== auth.tenantId) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
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
      await tx.post.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(slug !== undefined && { slug }),
          ...(content !== undefined && { content }),
          ...(excerpt !== undefined && { excerpt }),
          ...(coverImage !== undefined && { coverImage }),
          ...(categoryId !== undefined && { categoryId }),
          ...(published !== undefined && {
            published,
            publishedAt: published ? new Date() : null,
          }),
        },
      });

      if (tags !== undefined) {
        const tagNames: string[] = Array.isArray(tags)
          ? tags.filter((t: unknown) => typeof t === "string" && t.trim())
          : [];

        const resolvedTags = [];
        for (const raw of tagNames) {
          resolvedTags.push(await resolveTag(tx, raw));
        }
        const tagIds = resolvedTags.map((t) => t.id);

        await tx.postTag.deleteMany({
          where: { postId: id, tagId: { notIn: tagIds } },
        });

        for (const tagId of tagIds) {
          await tx.postTag.upsert({
            where: { postId_tagId: { postId: id, tagId } },
            create: { postId: id, tagId },
            update: {},
          });
        }
      }

      return tx.post.findUnique({
        where: { id },
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
      });
    });

    return NextResponse.json(post);
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing || existing.tenantId !== auth.tenantId) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await prisma.post.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
