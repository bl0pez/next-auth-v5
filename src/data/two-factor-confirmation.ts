import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });

    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};

export const deleteTwoFactorConfirmation = async (id: string) => {
  const twoFactorConfirmation = await db.twoFactorConfirmation.delete({
    where: {
      id,
    },
  });

  return twoFactorConfirmation;
};

export const createTwoFactorConfirmation = async (userId: string) => {
  const twoFactorConfirmation = await db.twoFactorConfirmation.create({
    data: {
      userId,
    },
  });

  return twoFactorConfirmation;
};
