"use server";
import { RegisterSchema, RegisterValues } from "@/schemas";

export const register = async (values: RegisterValues) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
    };
  }

  return {
    susccess: "Correo electrónico enviado con éxito.",
  };
};
