"use server";
import bcrypt from "bcryptjs";
import { RegisterSchema, RegisterValues } from "@/schemas";
import { createUser, getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: RegisterValues) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
    };
  }

  const { email, name, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      error: "El correo electrónico ya está en uso.",
    };
  }

  try {
    await createUser({
      email,
      name,
      password: hashedPassword,
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
    });

    return {
      susccess: "Correo de verificación enviado. Revisa tu bandeja de entrada.",
    };
  } catch (error) {
    return { error: "Algo salió mal." };
  }
};
