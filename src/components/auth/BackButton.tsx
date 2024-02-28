"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface Props {
  label: string;
  href: string;
}

export const BackButton = ({ href, label }: Props) => {
  return (
    <Button variant="link" className="w-full font-bold" size="sm" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};
