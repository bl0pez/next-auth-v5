import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { getVerificationTokenByEmail } from "@/data/verification-token";

export const generateVerificationToken = async (email: string) => {
  // Generamos un token único
  const token = uuidv4();

  // Generamos una fecha de expiración en 1 hora (3600 segundos) desde ahora.
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // Buscamos si ya existe un token para el email
  const existingToken = await getVerificationTokenByEmail(email);

  // Si existe un token para el email, lo eliminamos
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Creamos un nuevo token si no existe o eliminamos el anterior
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};
