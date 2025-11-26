document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("dark-mode-toggle");

  // Verifica se o modo escuro estava ativado
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "Modo Claro";
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      toggleBtn.textContent = "Modo Claro";
      localStorage.setItem("darkMode", "enabled");
    } else {
      toggleBtn.textContent = "Modo Escuro";
      localStorage.setItem("darkMode", "disabled");
    }
  });
});
