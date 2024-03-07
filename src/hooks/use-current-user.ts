import { useSession } from "next-auth/react";

/**
 * Este hook retorna o usuário atualmente autenticado
 * del lado del cliente.
 */
export const useCurrentUser = () => {
  const session = useSession();
  return session?.data?.user;
};
