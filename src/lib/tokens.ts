import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import { db } from "./db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetTokenByEmail,
} from "@/data/password-reset-token";
import {
  createTwoFactorToken,
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "@/data/two-factor-token";

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

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();

  // Generamos una fecha de expiración en 1 hora (3600 segundos) desde ahora.
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // Buscamos si ya existe un token para el email
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await deletePasswordResetToken(existingToken.id);
  }

  const passwordResetToken = await createPasswordResetToken({
    email,
    expires,
    token,
  });

  return passwordResetToken;
};

export const generateTwoFactorToken = async (email: string) => {
  // Generamos un token de 6 dígitos
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  // Generamos una fecha de expiración en 5 minutos (300 segundos) desde ahora.
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  // Buscamos si ya existe un token para el email
  const existingToken = await getTwoFactorTokenByEmail(email);

  // Si existe un token para el email, lo eliminamos
  if (existingToken) await deleteTwoFactorToken(existingToken.id);

  // Creamos un nuevo token si no existe o eliminamos el anterior
  const twoFactorTokenCreated = await createTwoFactorToken({
    email,
    expires,
    token,
  });

  return twoFactorTokenCreated.token;
};
