# 🚀 Portfolio Pessoal - Lucas Dias da Cunha

Um site pessoal moderno e responsivo construído com React, Tailwind CSS e integração com IA para chatbot. Este projeto está disponível como open source para que outros desenvolvedores possam usar, modificar e melhorar.

## ✨ Funcionalidades

- 🎨 **Design Responsivo**: Interface moderna que se adapta a todos os dispositivos
- 🌙 **Modo Escuro/Claro**: Alternância automática baseada na preferência do sistema
- 🤖 **Chatbot Inteligente**: Assistente virtual integrado com OpenAI GPT-4
- 📝 **Blog Integrado**: Carregamento automático de posts do Medium via RSS
- 📧 **Sistema de Contato**: Envio automático de conversas por email
- ⚡ **Performance Otimizada**: Carregamento rápido e experiência fluida
- 🔧 **Fácil Customização**: Código limpo e bem estruturado

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Vercel Serverless Functions
- **IA**: OpenAI GPT-4 API
- **Email**: Nodemailer
- **RSS**: xml2js para parsing do Medium
- **Deploy**: Vercel

## 🚀 Como Usar Este Projeto

### 1. Clone o Repositório

```bash
git clone https://github.com/lucascunha/lucasdcunha.git
cd lucasdcunha
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
OPENAI_API_KEY=sua_chave_openai_aqui
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_ou_app_password
```

### 4. Personalize o Conteúdo

#### Informações Pessoais
Edite o arquivo `src/App.js` e altere:
- Nome e descrição no header
- Seção "Sobre mim"
- Links das redes sociais
- Foto de perfil (substitua o arquivo em `src/assets/`)

#### Posts do Blog
- Altere a URL do RSS no arquivo `src/scripts/update-posts.js`
- Ou modifique o array `samplePosts` em `src/App.js` para posts estáticos

#### Chatbot
- Personalize o prompt do sistema em `api/chat.js`
- Configure o email de destino em `api/send-email.js`

### 5. Execute o Projeto

```bash
npm start
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
lucasdcunha/
├── public/
│   ├── posts.json          # Posts carregados dinamicamente
│   └── ...
├── src/
│   ├── assets/             # Imagens e recursos
│   ├── scripts/            # Scripts utilitários
│   ├── App.js              # Componente principal
│   ├── index.js            # Ponto de entrada
│   └── index.css           # Estilos globais
├── api/
│   ├── chat.js             # Endpoint do chatbot
│   └── send-email.js       # Endpoint de envio de email
├── tailwind.config.js      # Configuração do Tailwind
└── package.json
```

## 🎨 Customização

### Cores e Tema
As cores principais podem ser alteradas no arquivo `tailwind.config.js` ou diretamente nas classes CSS do `src/App.js`.

### Componentes
- **Chatbot**: Localizado na função `Chatbot()` em `src/App.js`
- **Posts**: Seção de blog na função principal `App()`
- **Sidebar**: Informações pessoais e links sociais

### Responsividade
O projeto usa classes responsivas do Tailwind CSS (`sm:`, `md:`, `lg:`, `xl:`).

## 🤖 Configuração do Chatbot

### OpenAI API
1. Crie uma conta em [OpenAI](https://platform.openai.com/)
2. Gere uma API key
3. Adicione a chave no arquivo `.env.local`

### Personalização do Comportamento
Edite o prompt do sistema em `api/chat.js`:

```javascript
const openaiMessages = [
  {
    role: "system",
    content: "Seu prompt personalizado aqui..."
  },
  // ...
];
```

## 📧 Sistema de Email

### Configuração Gmail
1. Ative a verificação em 2 etapas
2. Gere uma "Senha de app"
3. Use essa senha na variável `EMAIL_PASS`

### Outros Provedores
Modifique a configuração do transporter em `api/send-email.js`:

```javascript
const transporter = nodemailer.createTransporter({
  host: "seu-smtp-host.com",
  port: 587,
  auth: {
    user: "seu-email",
    pass: "sua-senha"
  }
});
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. Deploy automático a cada push

### Outras Plataformas
- **Netlify**: Suporte a serverless functions
- **Heroku**: Requer configuração adicional para APIs
- **AWS**: Lambda functions para as APIs

## 📝 Scripts Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Cria build de produção
npm test           # Executa os testes
npm run eject      # Ejeta as configurações do Create React App
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📋 Ideias para Melhorias

- [ ] Integração com Google Analytics
- [ ] Sistema de busca nos posts
- [ ] Integração com mais plataformas de blog
- [ ] Sistema de newsletter

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Lucas Dias da Cunha**
- LinkedIn: [@lucascunha](https://www.linkedin.com/in/lucascunha/)
- GitHub: [@lucascunha](https://github.com/lucascunha)
- Twitter: [@LcasCunha](https://x.com/LcasCunha)

## 🙏 Agradecimentos

- [React](https://reactjs.org/) - Framework JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide React](https://lucide.dev/) - Ícones
- [OpenAI](https://openai.com/) - API de IA
- [Vercel](https://vercel.com/) - Plataforma de deploy

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique as [Issues existentes](https://github.com/lucascunha/lucasdcunha/issues)
2. Crie uma nova issue com detalhes do problema
3. Entre em contato através do chatbot no site

---

**Feito com ❤️ por Lucas Dias da Cunha**