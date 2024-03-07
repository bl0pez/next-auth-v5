"use client";

import { logout } from "@/actions/auth/logout";

interface Props {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: Props) => {
  const onLogout = () => {
    logout();
  };

  return (
    <span onClick={onLogout} className="cursor-pointer">
      {children}
    </span>
  );
};
