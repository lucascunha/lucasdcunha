import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages (array) is required" });
  }

  const openaiMessages = [
    {
      role: "system",
      content:
        "Você é uma secretária virtual eficiente para o site do Lucas. Colete nome, e-mail ou telefone e motivo do contato. Quando tiver tudo, agradeça e encerre dizendo que Lucas retornará em breve. IMPORTANTE: Sempre que encerrar a conversa, inclua a frase 'Conversa finalizada' ao final da sua última mensagem.",
    },
    ...messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    })),
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: openaiMessages,
      max_tokens: 500,
      temperature: 0.5, // Menos criatividade, mais foco
    });

    const assistantResponse = response.choices[0].message.content;
    return res.status(200).json({ response: assistantResponse });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return res.status(500).json({
      error: "An error occurred while processing your request",
      details: error.message,
    });
  }
}