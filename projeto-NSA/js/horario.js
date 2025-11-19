document.addEventListener("DOMContentLoaded", () => {
  fetch('js/dados.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na rede ou arquivo não encontrado');
      }
      return response.json();
    })
    .then(aluno => {
      const horarioContainer = document.getElementById("horario-container");

      aluno.horario.forEach(dia => {
        // Cria uma nova tabela para cada dia
        const table = document.createElement("table");
        table.classList.add("horario-table");

        // Cabeçalho com o nome do dia
        const rowTitulo = document.createElement("tr");
        const cellTitulo = document.createElement("th");
        cellTitulo.colSpan = 3;
        cellTitulo.classList.add("dia-da-semana");
        cellTitulo.textContent = dia.dia;
        rowTitulo.appendChild(cellTitulo);
        table.appendChild(rowTitulo);

        // Cabeçalho das colunas
        const rowCabecalho = document.createElement("tr");
        ["Horário", "Disciplina", "Professor"].forEach(titulo => {
          const th = document.createElement("th");
          th.textContent = titulo;
          rowCabecalho.appendChild(th);
        });
        table.appendChild(rowCabecalho);

        // Aulas do dia
        dia.aulas.forEach(aula => {
          const rowAula = document.createElement("tr");

          const cellHorario = document.createElement("td");
          cellHorario.textContent = aula.horario;

          const cellDisciplina = document.createElement("td");
          cellDisciplina.textContent = aula.disciplina;

          const cellProfessor = document.createElement("td");
          cellProfessor.textContent = aula.professor || "-";

          rowAula.appendChild(cellHorario);
          rowAula.appendChild(cellDisciplina);
          rowAula.appendChild(cellProfessor);

          table.appendChild(rowAula);
        });

        // Adiciona a tabela do dia ao container
        horarioContainer.appendChild(table);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar os dados:', error);
    });
});
