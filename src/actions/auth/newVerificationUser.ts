"use server";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";

interface NewVerificationUser {
  token: string;
}

export const newVerificationUser = async ({ token }: NewVerificationUser) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) return { error: "Token no encontrado" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "El token ha expirado" };

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "Email no encontrado" };

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verificado correctamente" };
};
