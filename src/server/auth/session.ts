import "server-only";

import { cookies } from "next/headers";

import { prisma } from "@/lib/db/prisma";

import { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from "./constants";
import { toPublicUser, type PublicUser } from "./public-user";
import { createSessionToken, hashSessionToken } from "./session-token";

export type CreatedSession = {
  readonly token: string;
  readonly expiresAt: Date;
};

export async function createSession(userId: string): Promise<CreatedSession> {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashSessionToken(token),
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function getCurrentSessionToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const token = await getCurrentSessionToken();
  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    select: {
      id: true,
      expiresAt: true,
      revokedAt: true,
      lastSeenAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          deletedAt: true,
          roles: {
            select: {
              role: {
                select: { code: true },
              },
            },
          },
        },
      },
    },
  });

  const now = new Date();
  if (
    !session ||
    session.revokedAt ||
    session.expiresAt <= now ||
    session.user.deletedAt ||
    session.user.status !== "ACTIVE"
  ) {
    return null;
  }

  const refreshLastSeenAfterMs = 5 * 60 * 1000;
  if (now.getTime() - session.lastSeenAt.getTime() >= refreshLastSeenAfterMs) {
    await prisma.session.update({
      where: { id: session.id },
      data: { lastSeenAt: now },
    });
  }

  return toPublicUser(session.user);
}

export async function revokeSession(token: string): Promise<void> {
  await prisma.session.updateMany({
    where: {
      tokenHash: hashSessionToken(token),
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });
}
