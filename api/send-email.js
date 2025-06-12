import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { conversation } = req.body;

  if (!conversation || !Array.isArray(conversation)) {
    return res.status(400).json({ error: "Conversation is required" });
  }

  console.log("Recebido pedido de envio de email:", conversation);

  // Configure seu transporte SMTP (exemplo com Gmail)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // seu email
      pass: process.env.EMAIL_PASS  // senha ou app password
    }
  });

  // Monte o corpo do email
  const text = conversation.map(msg =>
    `[${msg.sender === "user" ? "Usuário" : "Bot"}]: ${msg.text}`
  ).join("\n");

  try {
    await transporter.sendMail({
      from: `"Chatbot Lucas" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // agora pega do .env
      subject: "Novo contato via Chatbot",
      text
    });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).json({ error: "Erro ao enviar email" });
  }
}