import { Prisma } from "@/lib/generated/prisma/client";

export async function resolveTag(
  tx: Prisma.TransactionClient,
  rawName: string,
) {
  const name = rawName.trim();

  let tag = await tx.tag.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });

  if (!tag) {
    try {
      tag = await tx.tag.create({ data: { name } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        tag = await tx.tag.findFirst({
          where: { name: { equals: name, mode: "insensitive" } },
        });
      } else {
        throw error;
      }
    }
  }

  return tag!;
}
