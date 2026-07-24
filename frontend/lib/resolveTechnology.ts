import { Prisma } from "@/lib/generated/prisma/client";

type TxClient =
  | Prisma.TransactionClient
  | Parameters<Parameters<Prisma.TransactionClient["$transaction"]>[0]>[0];

export async function resolveTechnology(
  tx: Prisma.TransactionClient,
  rawName: string,
) {
  const name = rawName.trim();

  let tech = await tx.technology.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });

  if (!tech) {
    try {
      tech = await tx.technology.create({ data: { name } });
    } catch (error) {
      // Race: another request created it between our find and create
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        tech = await tx.technology.findFirst({
          where: { name: { equals: name, mode: "insensitive" } },
        });
      } else {
        throw error;
      }
    }
  }

  return tech!;
}
