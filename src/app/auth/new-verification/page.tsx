import { Suspense } from "react";
import { BeatLoader } from "react-spinners";
import { CardWrapper } from "@/components/auth/CardWrapper";
import { NewVerificationForm } from "@/components/auth/NewVerificationForm";

interface Props {
  searchParams: {
    token: string;
  };
}

export default function newVerificationPage({ searchParams }: Props) {
  return (
    <CardWrapper
      headerLabel="Verificación de correo electrónico"
      backButtonHref="/auth/login"
      backButtonLabel="Volver a inicio de sesión"
    >
      <div className="flex items-center w-full justify-center">
        <Suspense fallback={<BeatLoader />}>
          <NewVerificationForm token={searchParams.token} />
        </Suspense>
      </div>
    </CardWrapper>
  );
}
