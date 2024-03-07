"use client";
import { logout } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const user = useCurrentUser();

  const onClick = () => {
    logout();
  };

  return (
    <div className="bg-white p-10 rounded-xl">
      <Button onClick={onClick}>Sign out</Button>
    </div>
  );
}
