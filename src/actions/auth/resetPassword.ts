"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetPasswordSchema, ResetPasswordValues } from "@/schemas";

export const resetPassword = async (values: ResetPasswordValues) => {
  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
    };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      error: "No existe un usuario con ese correo.",
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  if (!passwordResetToken) {
    return {
      error: "No se pudo generar el token de restablecimiento de contraseña.",
    };
  }

  try {
    await sendPasswordResetEmail({
      email,
      token: passwordResetToken.token,
    });

    return {
      success:
        "Correo enviado. Revisa tu bandeja de entrada para restablecer tu contraseña.",
    };
  } catch (error) {
    return {
      error: "No se pudo enviar el correo electrónico.",
    };
  }
};
