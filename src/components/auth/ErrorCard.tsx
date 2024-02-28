import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardWrapper } from "./CardWrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="¡Ups! ¡Algo salió mal!"
      backButtonHref="/auth/login"
      backButtonLabel="Volver a iniciar sesión"
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
