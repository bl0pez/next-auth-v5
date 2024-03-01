import { newVerificationUser } from "@/actions/auth/newVerificationUser";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";

interface Props {
  token: string;
}

export const NewVerificationForm = async ({ token }: Props) => {
  const resp = await newVerificationUser({ token: token });

  return (
    <>
      <FormSuccess message={resp.success} />
      <FormError message={resp.error} />
    </>
  );
};
