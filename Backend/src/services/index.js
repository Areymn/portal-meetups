// Se encontrarán ficheros que realicen funciones relacionadas entre sí (por ejemplo, un servicio de errores)

import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"Mi App" <miapp@example.com>',
    to,
    subject,
    text,
  });

  console.log("Email enviado: %s", info.messageId);
};
