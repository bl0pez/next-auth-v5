"use client";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";

import { admin } from "@/actions/admin/admin";
import { FormSuccess } from "@/components/FormSuccess";
import { RoleGate } from "@/components/auth/RoleGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminPage() {
  const onServerActionClick = async () => {
    const resp = await admin();

    if (!resp.ok) return toast.error(resp.message);

    toast.success(resp.message);
  };

  const onApiRouteClick = async () => {
    const resp = await fetch("/api/admin");
    if (!resp.ok) return toast.error("Failed to fetch");
    toast.success("Success");
  };
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="Bienvenido, administrador" />
        </RoleGate>
        <div className="flex flex-row items-center  justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Api Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div className="flex flex-row items-center  justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
}
