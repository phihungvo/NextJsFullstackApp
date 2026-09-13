import "server-only";

import argon2 from "argon2";

const DUMMY_PASSWORD_HASH =
  "$argon2id$v=19$m=65536,p=4,t=3$5AEjcDAO/6NFrsbwrRgxVg$WgUYKvPZNvD94sds7ObHOEn6vKu5VhWjreunXZcSq08";

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(password: string, passwordHash?: string): Promise<boolean> {
  try {
    return await argon2.verify(passwordHash ?? DUMMY_PASSWORD_HASH, password);
  } catch {
    return false;
  }
}
