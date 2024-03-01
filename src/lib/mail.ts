import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface IEmail {
  email: string;
  token: string;
}

export const sendVerificationEmail = async ({ email, token }: IEmail) => {
  const confirmLink = `${process.env.URL_BASE}/auth/new-verification?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Confirmación de correo electrónico",
    html: `<p>Click <a href="${confirmLink}">aquí</a> para confirmar tu correo electrónico. </p>`,
  });

  if (error) throw error;

  return data;
};
