import { db } from "@/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: {
        email,
      },
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const deletePasswordResetToken = async (id: string) => {
  await db.passwordResetToken.delete({
    where: { id },
  });
};

interface CreatePasswordResetTokenProps {
  email: string;
  token: string;
  expires: Date;
}

export const createPasswordResetToken = async ({
  email,
  expires,
  token,
}: CreatePasswordResetTokenProps) => {
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
