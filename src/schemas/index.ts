import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Ingresa un correo válido.",
  }),
  password: z.string().min(5, {
    message: "La contraseña debe tener al menos 5 caracteres.",
  }),
});
