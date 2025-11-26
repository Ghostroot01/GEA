document.addEventListener("DOMContentLoaded", () => {
  fetch('js/dados.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na rede ou arquivo não encontrado');
      }
      return response.json();
    })
    .then(aluno => {
      // --- CÓDIGO APENAS PARA A PÁGINA DE FALTAS (faltas.html) ---
      if (document.getElementById("total-faltas")) {
        let totalFaltas = 0;
        let totalAulas = 0;
        const disciplineList = document.getElementById("discipline-list");

        aluno.faltas.forEach((item) => {
          totalFaltas += item.faltas;
          totalAulas += item.totalAulas;

          const li = document.createElement("li");
          li.innerHTML = `
            <h4>${item.disciplina}</h4>
            <p><strong>Total de Aulas:</strong> ${item.totalAulas} | <strong>Faltas:</strong> ${item.faltas}</p>
          `;
          if (disciplineList) { // Adicionando uma verificação de segurança
            disciplineList.appendChild(li);
          }
        });

        const porcentagemPresenca =
          totalAulas > 0 ? ((totalAulas - totalFaltas) / totalAulas) * 100 : 0;

        document.getElementById("user-name").textContent = aluno.nome;
        document.getElementById("total-faltas").textContent = `${totalFaltas} faltas`;
        document.getElementById("total-aulas").textContent = `${totalAulas} aulas`;
      }
    })
    .catch(error => {
      console.error('Erro ao carregar os dados:', error);
    });
});