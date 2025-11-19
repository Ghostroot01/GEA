document.addEventListener("DOMContentLoaded", () => {
  fetch('js/dados.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na rede ou arquivo não encontrado');
      }
      return response.json();
    })
    .then(aluno => {
      if (document.getElementById("user-name")) {
        document.getElementById("user-name").textContent = aluno.nome;
        document.getElementById("welcome-user-name").textContent = aluno.nome;
        document.getElementById("user-rm").textContent = aluno.rm;
        document.getElementById("user-status").textContent = aluno.situacao;
        document.getElementById("user-course").textContent = aluno.curso;
        document.getElementById("user-class").textContent = aluno.turma;
        document.getElementById("latest-grade").textContent = aluno.latestGrade;
        document.getElementById("next-event").textContent = aluno.nextEvent;
        document.getElementById("new-material").textContent = aluno.newMaterial;

        const messageList = document.getElementById("message-list");
        if (messageList) {
          aluno.messages.forEach((message) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${message.date}</strong> - ${message.subject} <span>(${message.sender})</span>`;
            messageList.appendChild(li);
          });
        }

        const pendingList = document.getElementById("pending-list");
        if (pendingList) {
          aluno.pendings.forEach((pending) => {
            const li = document.createElement("li");
            li.textContent = pending;
            pendingList.appendChild(li);
          });
        }

        const newsContainer = document.getElementById("news-container");
        if (newsContainer) {
          aluno.news.forEach((newsItem) => {
            const div = document.createElement("div");
            div.className = "news-item";
            div.innerHTML = `
                <h4>${newsItem.title}</h4>
                <p>${newsItem.content}</p>
            `;
            newsContainer.appendChild(div);
          });
        }
      }
    })
    .catch(error => {
      console.error('Erro ao carregar os dados:', error);
    });
});