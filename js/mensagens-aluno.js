document.addEventListener("DOMContentLoaded", () => {
  fetch("js/dados.json")
    .then(response => response.json())
    .then(aluno => {
      const container = document.getElementById("mensagens-container");
      const mensagensLidas = JSON.parse(localStorage.getItem("mensagensLidas")) || [];

      aluno.messages.forEach((msg, index) => {
        const mensagemDiv = document.createElement("div");
        mensagemDiv.classList.add("mensagem");

        const idMensagem = `${msg.date}-${msg.subject}`.replace(/\s+/g, "-");

        // Verifica se essa mensagem já foi marcada como lida
        const isLida = mensagensLidas.includes(idMensagem);
        if (isLida) {
          mensagemDiv.classList.add("lida");
        }

        mensagemDiv.innerHTML = `
          <p><strong>Data:</strong> ${msg.date}</p>
          <p><strong>Assunto:</strong> ${msg.subject}</p>
          <p><strong>Remetente:</strong> ${msg.sender}</p>
        `;

        const botao = document.createElement("button");
        botao.textContent = isLida ? "Lida" : "Marcar como lida";
        botao.disabled = isLida;

        botao.addEventListener("click", () => {
          mensagemDiv.classList.add("lida");
          botao.textContent = "Lida";
          botao.disabled = true;

          mensagensLidas.push(idMensagem);
          localStorage.setItem("mensagensLidas", JSON.stringify(mensagensLidas));
        });

        mensagemDiv.appendChild(botao);
        container.appendChild(mensagemDiv);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar as mensagens:", error);
    });
});
