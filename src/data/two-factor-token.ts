import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: {
        token,
      },
    });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const deleteTwoFactorToken = async (id: string) => {
  const twoFactorToken = await db.twoFactorToken.delete({
    where: {
      id,
    },
  });

  return twoFactorToken;
};

interface CreateTwoFactorTokenProps {
  email: string;
  expires: Date;
  token: string;
}

export const createTwoFactorToken = async (data: CreateTwoFactorTokenProps) => {
  const twoFactorToken = await db.twoFactorToken.create({
    data,
  });

  return twoFactorToken;
};
