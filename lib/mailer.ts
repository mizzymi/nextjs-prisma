import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT || "465");
const secure = port === 465;

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  logger: process.env.NODE_ENV !== "production",
  debug: process.env.NODE_ENV !== "production",
});

export function verifyEmailTemplates(verifyUrl: string) {
  const subject = `PokeDeck · Verifica tu email`;
  const text = `Hola,\n\nVerifica tu email con este enlace:\n${verifyUrl}\n\nSi no fuiste tú, ignora este correo.`;
  const html = `<!doctype html><html><body style="font-family:system-ui">
    <h2>PokeDeck – Verifica tu email</h2>
    <p>Haz clic en el botón:</p>
    <p><a href="${verifyUrl}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#0f766e;color:#fff;text-decoration:none">Verificar email</a></p>
    <p>O pega este enlace:</p>
    <p style="word-break:break-all">${verifyUrl}</p>
  </body></html>`;
  return { subject, text, html };
}
