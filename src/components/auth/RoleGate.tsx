"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "../FormError";

interface Props {
  allowedRole: string;
  children: React.ReactNode;
}

export const RoleGate = ({ allowedRole, children }: Props) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return <FormError message="No tienes permisos para ver esta página" />;
  }

  return <>{children}</>;
};
