import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ExternalLink, Github, Linkedin, Twitter, MessageCircle, Send } from 'lucide-react';
import profileImg from './assets/lucas-cunha-senior-software-engineer-java-spring-microservices.jpg';

// Posts de exemplo - carregados do Medium em caso de Fallback
const samplePosts = [
  {
    "id": 1,
    "title": "Do Terraform à IA Multicloud: Lições e Implementações do “MultiCloud, DevOps & IA Challenge”",
    "date": "2025-04-09",
    "excerpt": "",
    "slug": "do-terraform-ia-multicloud-li-es-e-implementa-es-do-multicloud-devops-ia-challenge-",
    "url": "https://medium.com/@lucas-cunha/do-terraform-%C3%A0-ia-multicloud-li%C3%A7%C3%B5es-e-implementa%C3%A7%C3%B5es-do-multicloud-devops-ia-challenge-2b62906b8469?source=rss-7238cd32a68------2",
    "platform": "medium",
    "readTime": "5 min"
  },
  {
    "id": 2,
    "title": "Como mudei de carreira aos 36",
    "date": "2021-07-29",
    "excerpt": "",
    "slug": "como-mudei-de-carreira-aos-36",
    "url": "https://medium.com/@lucas-cunha/como-mudei-de-carreira-aos-36-ca66196f61f7?source=rss-7238cd32a68------2",
    "platform": "medium",
    "readTime": "5 min"
  }
];

// Componente do Chatbot
function Chatbot({ isOpen, onClose }) {
  // Corrija o valor inicial:
  const [messages, setMessages] = useState([
    { id: 1, text: "Olá! Como posso te ajudar hoje?", sender: "assistant" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkIfShouldSendEmail = (assistantText) => {
    return assistantText.toLowerCase().includes("conversa finalizada");
  };

  const cleanAssistantText = (text) =>
    text.replace(/conversa finalizada/gi, "").trim();

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user"
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    setIsTyping(true);

    try {
      const apiUrl = '/api/chat';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro desconhecido');
      }

      const data = await response.json();
      const assistantMessage = {
        id: Date.now() + 1,
        text: cleanAssistantText(data.response) || "Desculpe, não consegui entender. Tente novamente.",
        sender: "assistant"
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Checa se deve enviar o email
      if (checkIfShouldSendEmail(assistantMessage.text)) {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversation: [...updatedMessages, assistantMessage] })
        });
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Erro ao conectar com o servidor. Tente novamente mais tarde.",
          sender: "assistant"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border z-50">
      <div className="flex justify-between items-center p-4 border-b bg-blue-600 text-white rounded-t-lg">
        <h3 className="font-semibold">Chat com Lucas</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200 text-xl">
          ×
        </button>
      </div>

      <div className="flex-1 p-4 h-64 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block max-w-xs px-4 py-2 rounded-lg ${message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-left mb-3">
            <div className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente principal
function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [showMoreAbout, setShowMoreAbout] = useState(false); // Novo estado

  // Carrega os posts quando o componente monta
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch('/posts.json');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
        setPosts(samplePosts); // Fallback
      }

      setLoading(false);
    };

    loadPosts();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <img
              src={profileImg}
              alt="Lucas Dias da Cunha"
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-600 shadow"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lucas Dias da Cunha</h1>
              <p className="text-gray-600">Software Developer - Especializado em Desenvolvimento Backend</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Últimos Posts</h2>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <article key={post.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="group">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {post.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            {formatDate(post.date)}
                          </div>
                          {post.platform && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {post.platform === 'medium' ? 'Medium' : post.platform}
                            </span>
                          )}
                          {post.readTime && (
                            <span className="text-gray-400">
                              {post.readTime}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                        <div className="mt-3">
                          <a
                            href={post.url || `#`}
                            target={post.url ? "_blank" : "_self"}
                            rel={post.url ? "noopener noreferrer" : ""}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center hover:underline"
                          >
                            {post.url ? 'Ler no Medium' : 'Ler mais'}
                            <ExternalLink size={14} className="ml-1" />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sobre mim */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre mim</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Desenvolvedor apaixonado por tecnologia, especializado em arquiteturas modernas e escaláveis.
                Tenho experiência com Java, Spring, Microserviços e Cloud Computing.
              </p>
              <button
                className="mt-3 text-blue-600 hover:underline text-sm"
                onClick={() => setShowMoreAbout((v) => !v)}
              >
                {showMoreAbout ? "Ocultar detalhes" : "Quer saber mais sobre minha experiência? Clique aqui"}
              </button>
              {showMoreAbout && (
                <div className="mt-4 text-gray-700 text-sm leading-relaxed border-t pt-4">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>12+ anos atuando em projetos de TI para <strong>meios de pagamento e autoatendimento</strong>.</li>
                    <li>Java &nbsp;•&nbsp; Spring Boot &nbsp;•&nbsp; arquitetura de <strong>microserviços</strong> de alta disponibilidade.</li>
                    <li>Mensageria <strong>ISO-8583</strong> e criptografia HSM para transações seguras.</li>
                    <li>Ajudo a integrar a maior rede de <strong>ATMs</strong> do Brasil a +40 instituições financeiras.</li>
                    <li>Experiência com Cloud &nbsp;(<strong>AWS</strong>, OpenShift) com pipelines CI/CD (GitLab) e Docker.</li>
                    <li>Background em gestão de projetos, análise de requisitos e homologação.</li>
                    <li>MBA em Full Stack Dev (Impacta) &nbsp;|&nbsp; MBA em Data Science & Analytics (USP).</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Links sociais */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conecte-se</h3>
              <div className="space-y-3">
                <a href="https://www.linkedin.com/in/lucascunha/" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors">
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
                <a href="https://github.com/lucascunha" className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors">
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
                <a href="https://x.com/LcasCunha" className="flex items-center space-x-3 text-gray-700 hover:text-blue-400 transition-colors">
                  <Twitter size={20} />
                  <span>Twitter</span>
                </a>
              </div>
            </div>

            {/* Contato */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato</h3>
              <p className="text-gray-700 text-sm mb-4">
                Tem alguma dúvida ou quer bater um papo? Use o chat!
              </p>
              <button
                onClick={() => setChatOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle size={18} />
                <span>Abrir Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">
            © 2025 Lucas Dias da Cunha. Feito com React e Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;