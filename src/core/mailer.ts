import nodemailer from 'nodemailer';
import env from './env';
import logger from './logger';

const transporter = nodemailer.createTransport(
  env.NODE_ENV === 'test'
    ? { jsonTransport: true }
    : {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE ?? env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS
        }
      }
);

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendMail(options: SendMailOptions) {
  const from = env.SMTP_FROM ?? env.ADMIN_EMAIL;
  const payload = { ...options, from };
  const info = await transporter.sendMail(payload);
  logger.info({ messageId: info.messageId, to: options.to }, 'Correo enviado');
  return info;
}

export default transporter;
