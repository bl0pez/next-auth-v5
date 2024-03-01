"use server";
import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
    };
  }

  const { email, password } = validatedFields.data;

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
