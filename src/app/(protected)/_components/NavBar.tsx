"use client";

import { UserButton } from "@/components/auth/UserButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    path: "/server",
    label: "Server",
  },
  {
    path: "/client",
    label: "Client",
  },
  {
    path: "/admin",
    label: "Admin",
  },
  {
    path: "/settings",
    label: "Settings",
  },
];

export const NavBar = () => {
  const pathName = usePathname();

  return (
    <nav
      className="bg-secondary flex justify-between items-center p-4 rounded-xl 
      w-[600px] shadow-sm"
    >
      <div className="flex gap-x-2">
        {routes.map((route) => (
          <Button
            key={route.path}
            variant={pathName === route.path ? "default" : "outline"}
            asChild
          >
            <Link href={route.path}>{route.label}</Link>
          </Button>
        ))}
      </div>
      <UserButton />
    </nav>
  );
};
