const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai'); // Importação corrigida

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../')); // Servir arquivos estáticos da pasta raiz

// Configurar OpenAI - versão atualizada
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint para o chat
app.post('/api/chat', async (req, res) => {
  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    // Fazer a chamada à API OpenAI - sintaxe atualizada
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "Você é uma secretária virtual educada, simpática e eficiente. Seu papel é atender pessoas que acessam o site pessoal do Lucas e desejam entrar em contato com ele. Sua tarefa é: Cumprimentar cordialmente a pessoa. Coletar as seguintes informações de forma natural e educada: Nome completo E-mail (ou outra forma de contato preferida) Assunto que deseja tratar ou motivo do contato Agradecer pelo contato e informar que você irá repassar as informações para o [Seu Nome], e que ele entrará em contato assim que possível. Importante: Mantenha um tom amigável, profissional e acolhedor. Seja objetivo, mas gentil ao conduzir a conversa. Se a pessoa não quiser fornecer alguma informação, seja respeitosa e pergunte se há outra forma de contato ou se deseja deixar uma mensagem mesmo assim. Ao final, confirme se todas as informações estão corretas antes de encerrar. Exemplo de encerramento: 'Muito obrigado(a), [nome]! Vou repassar suas informações para o [Seu Nome], e ele entrará em contato com você em breve. Tenha um ótimo dia!'"
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    // Extrair e retornar a resposta - sintaxe atualizada
    const assistantResponse = response.choices[0].message.content;
    return res.status(200).json({ response: assistantResponse });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: error.message 
    });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});