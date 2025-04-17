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
    const { conversationHistory } = req.body;

    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return res.status(400).json({ error: 'conversationHistory é obrigatório e deve ser um array' });
    }

    // Fazer a chamada à API OpenAI com o histórico completo
    const response = await openai.chat.completions.create({
      model: "gpt-4.1", // ou outro modelo disponível na sua conta
      messages: conversationHistory,
      max_tokens: 500 // Limitar o tamanho da resposta
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