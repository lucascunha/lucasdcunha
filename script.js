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

  let conversationHistory = [
    {
      role: "system",
      content: "Você é uma secretária virtual educada, simpática e eficiente. Seu papel é atender pessoas que acessam o site pessoal do Lucas e desejam entrar em contato com ele. Sua tarefa é: Cumprimentar cordialmente a pessoa. Coletar as seguintes informações de forma natural e educada: Nome completo E-mail (ou outra forma de contato preferida) Assunto que deseja tratar ou motivo do contato Agradecer pelo contato e informar que você irá repassar as informações para o Lucas, e que ele entrará em contato assim que possível. Importante: Mantenha um tom amigável, profissional e acolhedor. Seja objetivo, mas gentil ao conduzir a conversa. Se a pessoa não quiser fornecer alguma informação, seja respeitosa e pergunte se há outra forma de contato ou se deseja deixar uma mensagem mesmo assim. Ao final, confirme se todas as informações estão corretas antes de encerrar. Exemplo de encerramento: 'Muito obrigado(a), [nome]! Vou repassar suas informações para o Lucas, e ele entrará em contato com você em breve. Tenha um ótimo dia!'"
    }
  ];
  
  // Abrir o modal quando clicar no botão de contato
  contactButton.addEventListener('click', function(e) {
    e.preventDefault();
    modal.style.display = 'flex';
    
    // Limpar histórico de conversa anterior
    conversationHistory = [
      {
        role: "system",
        content: "Você é um secretário virtual educado, simpático e eficiente. Seu papel é atender pessoas que acessam o site pessoal do Lucas e desejam entrar em contato com ele. Sua tarefa é: Cumprimentar cordialmente a pessoa. Coletar as seguintes informações de forma natural e educada: Nome completo E-mail (ou outra forma de contato preferida) Assunto que deseja tratar ou motivo do contato Agradecer pelo contato e informar que você irá repassar as informações para o Lucas, e que ele entrará em contato assim que possível. Importante: Mantenha um tom amigável, profissional e acolhedor. Seja objetivo, mas gentil ao conduzir a conversa. Se a pessoa não quiser fornecer alguma informação, seja respeitosa e pergunte se há outra forma de contato ou se deseja deixar uma mensagem mesmo assim. Ao final, confirme se todas as informações estão corretas antes de encerrar. Exemplo de encerramento: 'Muito obrigado(a), [nome]! Vou repassar suas informações para o Lucas, e ele entrará em contato com você em breve. Tenha um ótimo dia!'"
      }
    ];
    
    // Limpar mensagens anteriores
    chatMessages.innerHTML = '';
    
    // Adicionar a primeira mensagem do assistente
    const initialMessage = 'Olá! Sou o assistente virtual do Lucas. Como posso ajudar você hoje? Por favor, me informe seu nome e o assunto que gostaria de tratar.';
    addMessage(initialMessage, 'assistant');
    
    // Adicionar a mensagem inicial ao histórico
    conversationHistory.push({
      role: "assistant",
      content: initialMessage
    });
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

    // Adicionar mensagem do usuário ao histórico
  conversationHistory.push({
    role: "user",
    content: message
  });
    
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
  
  // Função para chamar a API da OpenAI através do nosso endpoint Node.js
  async function callOpenAI(userMessage) {
    try {
      // Adicionar indicador de digitação
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'message assistant-message';
      typingIndicator.textContent = 'Digitando...';
      typingIndicator.id = 'typing-indicator';
      chatMessages.appendChild(typingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      console.log("Enviando conversa para o backend:", conversationHistory);
      
      // URL do endpoint - ajuste conforme seu ambiente
      // Use uma URL absoluta durante o desenvolvimento
      const apiUrl = '/api/chat';
      
      // Chamar nosso endpoint Node.js
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationHistory }),
      });
      
      // Remover indicador de digitação
      const typingElement = document.getElementById('typing-indicator');
      if (typingElement) {
        typingElement.remove();
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta da API:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log("Resposta recebida do backend:", data);
      
      // Adicionar resposta do assistente ao chat
      addMessage(data.response, 'assistant');

      // Adicionar resposta do assistente ao histórico
    conversationHistory.push({
      role: "assistant",
      content: data.response
    });
      
    } catch (error) {
      console.error('Erro ao chamar a API:', error);
      
      // Remover indicador de digitação se ainda existir
      const typingElement = document.getElementById('typing-indicator');
      if (typingElement) {
        typingElement.remove();
      }
      
      addMessage('Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.', 'assistant');
    }
  }
});