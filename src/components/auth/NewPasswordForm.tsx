"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { CardWrapper } from "./CardWrapper";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { NewPasswordSchema, NewPasswordValues } from "@/schemas";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/auth/newPassword";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<NewPasswordValues>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const onSubmit = async (values: NewPasswordValues) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      newPassword({
        ...values,
        token,
      }).then((data) => {
        if (data?.error) return setError(data.error);
        if (data?.success) return setSuccess(data.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Ingresa tu nueva contraseña"
      backButtonLabel="Volver a inicio de sesión"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="newPassword">Nueva contraseña</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Nueva contraseña"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* error message */}
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Restablecer contraseña
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
