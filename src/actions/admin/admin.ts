"use server";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  const role = await currentRole();

  if (role !== UserRole.ADMIN) {
    return {
      ok: false,
      message: "Necesitas ser administrador para realizar esta acción",
    };
  }

  return {
    ok: true,
    message: "Acción realizada con éxito",
  };
};
