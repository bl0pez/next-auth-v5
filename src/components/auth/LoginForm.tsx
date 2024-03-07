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
import { LoginSchema, LoginValues } from "@/schemas";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { login } from "@/actions/auth/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
  const searchParams = useSearchParams();

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Correo electronico ya registrado, pruebe con otro proveedor"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values).then((data) => {
        if (data?.success) setSuccess(data.success);
        if (data?.error) setError(data.error);

        if (data?.twoFactor) {
          setShowTwoFactor(true);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Bienvenido"
      backButtonLabel="No tienes cuenta? Registrate"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {showTwoFactor ? (
              <>
                {/* Code */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="code">code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="123456"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                {/* email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="john_doe@gmail.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="*****"
                          type="password"
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset-password">
                          Olvidaste tu contraseña? Click aquí
                        </Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          {/* error message */}
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {showTwoFactor ? "Verificar" : "Iniciar sesión"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
