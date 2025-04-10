// Atualiza o ano no rodapé
document.getElementById("year").textContent = new Date().getFullYear();

// Navegação entre seções
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      
      // Esconde todas as seções
      sections.forEach((section) => {
        section.style.display = "none";
      });
      
      // Mostra a seção alvo
      document.getElementById(targetId).style.display = "block";
      
      // Remove a classe 'active' de todos os links
      navLinks.forEach((navLink) => {
        navLink.classList.remove("active");
      });
      
      // Adiciona a classe 'active' ao link clicado
      this.classList.add("active");
    });
  });

  // Exibe a primeira seção por padrão
  sections.forEach((section) => {
    section.style.display = "none";
  });
  sections[0].style.display = "block";
});

// Alternar entre o tema claro e escuro
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-theme");

    // Update button icon
    if (body.classList.contains("dark-theme")) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem("theme", "dark");
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem("theme", "light");
    }
  });
});

// Add assitente virtual

document.addEventListener('DOMContentLoaded', function() {
  // Elementos do modal
  const modal = document.getElementById('contact-modal');
  const contactButton = document.getElementById('contact-button');
  const closeButton = document.querySelector('.close-button');
  const sendButton = document.getElementById('send-button');
  const userInput = document.getElementById('user-input');
  const chatMessages = document.getElementById('chat-messages');
  
  // Abrir o modal quando clicar no botão de contato
  contactButton.addEventListener('click', function(e) {
    e.preventDefault();
    modal.style.display = 'flex'; // Usar flex em vez de block
    // Adicionar a primeira mensagem do assistente
    addMessage('Olá! Sou a assistente virtual do Lucas. Como posso ajudar você hoje? Por favor, me informe seu nome e o assunto que gostaria de tratar.', 'assistant');
  });
  
  // Fechar o modal quando clicar no X
  closeButton.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  // Fechar o modal quando clicar fora dele
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Enviar mensagem quando clicar no botão de enviar
  sendButton.addEventListener('click', sendMessage);
  
  // Enviar mensagem quando pressionar Enter
  userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Função para enviar mensagem
  function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    // Adicionar mensagem do usuário ao chat
    addMessage(message, 'user');
    
    // Limpar input
    userInput.value = '';
    
    // Simular "digitando..."
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message assistant-message';
    typingIndicator.textContent = 'Digitando...';
    typingIndicator.id = 'typing-indicator';
    chatMessages.appendChild(typingIndicator);
    
    // Chamar a API da OpenAI (simulado por enquanto)
    setTimeout(() => {
      // Remover indicador de digitação
      document.getElementById('typing-indicator').remove();
      
      // Aqui você implementará a chamada real à API da OpenAI
      callOpenAI(message);
    }, 1500);
  }
  
  // Função para adicionar mensagem ao chat
  function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    
    // Rolar para a mensagem mais recente
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Função para chamar a API da OpenAI
  async function callOpenAI(userMessage) {
    try {
      // Esta é a estrutura básica para quando você implementar a API real
      // Por enquanto, vamos apenas simular uma resposta
      
      /* 
      // Código para implementação futura da API da OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer SUA_CHAVE_API_AQUI'
        },
        body: JSON.stringify({
          model: "gpt-4", // ou outro modelo de sua escolha
          messages: [
            {
              role: "system",
              content: "Você é uma assistente virtual que coleta informações de contato. Seu objetivo é obter o nome, email e assunto de interesse do usuário de forma amigável e profissional."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          max_tokens: 150
        })
      });
      
      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;
      */
      
      // Simulação de resposta para teste
      
      let assistantResponse;
      
      if (userMessage.toLowerCase().includes('olá') || userMessage.toLowerCase().includes('oi')) {
        assistantResponse = "Olá! Por favor, me informe seu nome completo e email para que o Lucas possa entrar em contato com você.";
      } else if (userMessage.toLowerCase().includes('@')) {
        assistantResponse = "Obrigada pelo seu email! Qual é o assunto que você gostaria de tratar com o Lucas?";
      } else {
        assistantResponse = "Obrigada pelas informações! Vou repassar para o Lucas e ele entrará em contato em breve. Posso ajudar com mais alguma coisa?";
      }
      
      // Adicionar resposta do assistente ao chat
      addMessage(assistantResponse, 'assistant');
      
    } catch (error) {
      console.error('Erro ao chamar a API:', error);
      addMessage('Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.', 'assistant');
    }
  }
});
