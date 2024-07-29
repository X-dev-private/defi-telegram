// Importar os módulos necessários
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config(); // Importar e configurar o dotenv

// Configurar o servidor Express
const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

app.use(bodyParser.json());

// Armazenar o chatId em memória (para simplificação, usar um banco de dados em produção)
let chatId = null;

// Endpoint para Telegram enviar mensagens
app.post('/webhook', (req, res) => {
  const { message } = req.body;

  if (message) {
    chatId = message.chat.id;
    const text = message.text;

    if (text === '/start') {
      // Responder com uma mensagem de boas-vindas
      fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Bem-vindo ao nosso bot! Como posso ajudar você hoje?`,
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Mensagem de boas-vindas enviada:', data);
      })
      .catch(error => {
        console.error('Erro ao enviar mensagem de boas-vindas:', error);
      });
    } else {
      // Responder com a mesma mensagem
      fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Você disse: ${text}`,
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Mensagem enviada:', data);
      })
      .catch(error => {
        console.error('Erro ao enviar mensagem:', error);
      });
    }
  }

  res.sendStatus(200);
});

// Endpoint para enviar mensagens ao Telegram a partir da aplicação
app.post('/api/send-message', async (req, res) => {
  const { message } = req.body;

  if (!chatId) {
    return res.status(400).send('chatId não definido. Envie uma mensagem com o comando /start para iniciar.');
  }

  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const data = await response.json();
    console.log('Mensagem enviada:', data);
    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.sendStatus(500);
  }
});

// Configurar o webhook ao iniciar o servidor
const setWebhook = async () => {
  const webhookUrl = `https://seu-dominio.com/webhook`; // Troque pelo seu domínio real

  try {
    const response = await fetch(`${TELEGRAM_API}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl }),
    });

    const data = await response.json();
    console.log('Webhook configurado:', data);
  } catch (error) {
    console.error('Erro ao configurar o webhook:', error);
  }
};

// Iniciar o servidor e configurar o webhook
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  setWebhook(); // Configurar o webhook ao iniciar o servidor
});
