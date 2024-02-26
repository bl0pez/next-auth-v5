import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Ingresa un correo válido.",
  }),
  password: z.string().min(5, {
    message: "La contraseña debe tener al menos 5 caracteres.",
  }),
});

export interface LoginValues extends z.infer<typeof LoginSchema> {}

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Ingresa un correo válido.",
  }),
  password: z.string().min(5, {
    message: "La contraseña debe tener al menos 5 caracteres.",
  }),
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
});

export interface RegisterValues extends z.infer<typeof RegisterSchema> {}
