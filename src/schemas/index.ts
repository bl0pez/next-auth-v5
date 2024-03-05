import * as z from "zod";

const validations = {
  email: z.string().email({
    message: "Ingresa un correo válido.",
  }),
  password: z.string().min(5, {
    message: "La contraseña debe tener al menos 5 caracteres.",
  }),
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
};

export const LoginSchema = z.object({
  email: validations.email,
  password: validations.password,
});

export interface LoginValues extends z.infer<typeof LoginSchema> {}

export const RegisterSchema = z.object({
  email: validations.email,
  password: validations.password,
  name: validations.name,
});

export interface RegisterValues extends z.infer<typeof RegisterSchema> {}

export const ResetPasswordSchema = z.object({
  email: validations.email,
});

export interface ResetPasswordValues
  extends z.infer<typeof ResetPasswordSchema> {}
