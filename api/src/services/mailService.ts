import nodemailer from "nodemailer";

export async function sendTicketEmail(
  to: string,
  name: string,
  ticketCode: string,
  pdfBuffer: Buffer
) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Tiket Wisata Anda",
    html: `
      <p>Halo <b>${name}</b>,</p>
      <p>Pembayaran Anda <b>berhasil</b>.</p>
      <p>Terlampir tiket resmi Anda.</p>
      <p><b>Kode Tiket:</b> ${ticketCode}</p>
    `,
    attachments: [
      {
        filename: `ticket-${ticketCode}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
