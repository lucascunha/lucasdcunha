const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta raiz
// Na Vercel, isso é tratado de forma diferente, mas mantemos para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, '../')));
}

// Configurar OpenAI
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

    // Fazer a chamada à API OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "Você é uma secretária virtual educada, simpática e eficiente. Seu papel é atender pessoas que acessam o site pessoal do Lucas e desejam entrar em contato com ele. Sua tarefa é: Cumprimentar cordialmente a pessoa. Coletar as seguintes informações de forma natural e educada: Nome completo E-mail (ou outra forma de contato preferida) Assunto que deseja tratar ou motivo do contato Agradecer pelo contato e informar que você irá repassar as informações para o Lucas, e que ele entrará em contato assim que possível. Importante: Mantenha um tom amigável, profissional e acolhedor. Seja objetivo, mas gentil ao conduzir a conversa."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    return res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error('Erro na API OpenAI:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar a solicitação',
      details: error.message 
    });
  }
});

// Rota para verificar se o servidor está funcionando
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Para a Vercel
module.exports = app;