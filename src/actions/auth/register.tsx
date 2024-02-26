"use server";
import bcrypt from "bcryptjs";
import { RegisterSchema, RegisterValues } from "@/schemas";
import { db } from "@/lib/db";
import { createUser, getUserByEmail } from "@/data/user";

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

  await createUser({
    email,
    name,
    password: hashedPassword,
  });

  //? TODO: Send email to user

  return {
    susccess: "Usuario registrado con éxito",
  };
};
