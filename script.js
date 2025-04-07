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
      sections.forEach((section) => {
        section.style.display = "none";
      });
      document.getElementById(targetId).style.display = "block";
    });
  });

  // Exibe a primeira seção por padrão
  sections.forEach((section) => {
    section.style.display = "none";
  });
  sections[0].style.display = "block";
});
// Validação do formulário de contato (exemplo simples)
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (name && email && message) {
      alert("Formulário enviado com sucesso!");
      this.reset();
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  });
