import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface IEmail {
  email: string;
  token: string;
}

export const sendPasswordResetEmail = async ({ email, token }: IEmail) => {
  const resetLink = `${process.env.URL_BASE}/auth/new-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Restablecer contraseña",
    html: `<p>Click <a href="${resetLink}">aquí</a> para restablecer tu contraseña. </p>`,
  });

  if (error) null;

  return data;
};

export const sendVerificationEmail = async ({ email, token }: IEmail) => {
  const confirmLink = `${process.env.URL_BASE}/auth/new-verification?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Confirmación de correo electrónico",
    html: `<p>Click <a href="${confirmLink}">aquí</a> para confirmar tu correo electrónico. </p>`,
  });

  if (error) null;

  return data;
};

export const sendTwoFactorTokenEmail = async ({ email, token }: IEmail) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "2FA Código de verificación",
    html: `<p>Tu código de verificación es: <strong>${token}</strong></p>`,
  });

  if (error) null;

  return data;
};
