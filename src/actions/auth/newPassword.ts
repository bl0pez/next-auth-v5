"use server";
import bcrypt from "bcryptjs";

import {
  deletePasswordResetToken,
  getPasswordResetTokenByToken,
} from "@/data/password-reset-token";
import { getUserByEmail, updateUser } from "@/data/user";
import { NewPasswordValues, NewPasswordSchema } from "@/schemas";

export const newPassword = async (values: NewPasswordValues) => {
  const { token } = values;

  if (!token) {
    return { error: "Token inválido." };
  }

  const validateFields = NewPasswordSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: validateFields.error.message };
  }

  const { newPassword } = validateFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) return { error: "Token inválido." };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "El token ha expirado." };

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "Correo electrónico inválido." };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedPassword = await updateUser(existingUser.id, {
    password: hashedPassword,
  });

  if (!updatedPassword) return { error: "Error al actualizar la contraseña." };

  await deletePasswordResetToken(existingToken.id);

  return { success: "Contraseña actualizada." };
};
