import { db } from "@/lib/db";
import { RegisterValues } from "@/schemas";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (UserId: string) => {
  try {
    const user = await db.user.findUnique({ where: { UserId } });
    return user;
  } catch (error) {
    return null;
  }
};

export const createUser = async (data: RegisterValues) => {
  try {
    const user = await db.user.create({ data });
    return user;
  } catch (error) {
    return null;
  }
};
