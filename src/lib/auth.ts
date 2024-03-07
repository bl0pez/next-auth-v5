import { auth } from "@/auth";

/**
 * Este método retorna o usuário atualmente autenticado
 * del lado del servidor.
 *
 */
export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user.role;
};
