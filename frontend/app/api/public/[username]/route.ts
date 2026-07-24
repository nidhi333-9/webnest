import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { username },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });

  if (!tenant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ tenant });
}
