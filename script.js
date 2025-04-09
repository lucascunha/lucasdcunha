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