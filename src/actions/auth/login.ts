"use server";
import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import {
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "@/data/two-factor-token";
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
    };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser?.email || !existingUser?.password) {
    return {
      error: "Credenciales inválidas.",
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    const sendEmail = await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
    });

    if (!sendEmail)
      return { error: "Error al enviar el correo de verificación." };

    return {
      success: "Correo de verificación enviado. Revisa tu bandeja de entrada.",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) return { error: "Código inválido." };

      if (twoFactorToken.token !== code) return { error: "Código inválido." };

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) return { error: "Código expirado." };

      await deleteTwoFactorToken(twoFactorToken.id);

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation)
        await deleteTwoFactorConfirmation(existingConfirmation.id);

      await createTwoFactorConfirmation(existingUser.id);
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail({
        email: existingUser.email,
        token: twoFactorToken,
      });
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas." };
        case "AuthorizedCallbackError":
          return { error: "Error de autenticación." };
        case "OAuthAccountNotLinked":
          return { error: "Account already exists." };
        default:
          return { error: "Algo salió mal." };
      }
    }
    throw error;
  }
};
