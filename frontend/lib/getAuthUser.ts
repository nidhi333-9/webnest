import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          memberships: {
            include: { tenant: true },
          },
        },
      },
    },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  const membership = session.user.memberships[0];
  if (!membership) return null;

  return {
    userId: session.userId,
    tenantId: membership.tenantId,
    username: membership.tenant.username,
  };
}
