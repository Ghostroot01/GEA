// Lista de aulas de informática do dia
const aulas = [
    { horario: "08:00 - 09:00", disciplina: "Introdução à Informática", sala: "Lab 01", status: "Confirmada" },
    { horario: "09:00 - 10:00", disciplina: "Pacote Office: Word", sala: "Lab 01", status: "Confirmada" },
    { horario: "10:00 - 11:00", disciplina: "Internet Segura", sala: "Lab 02", status: "Pendente" },
    { horario: "11:00 - 12:00", disciplina: "Fundamentos de Programação", sala: "Lab 03", status: "Confirmada" },
    { horario: "13:30 - 14:30", disciplina: "Manutenção de Computadores", sala: "Lab 01", status: "Confirmada" },
    { horario: "14:30 - 15:30", disciplina: "Redes de Computadores", sala: "Lab 02", status: "Pendente" }
];

// Carrega as opções únicas de sala no select
function carregarSalas() {
    const select = document.getElementById('filtroSala');
    const salasUnicas = [...new Set(aulas.map(a => a.sala))];

    salasUnicas.forEach(sala => {
        const option = document.createElement('option');
        option.value = sala;
        option.textContent = sala;
        select.appendChild(option);
    });
}

// Carrega as aulas na tabela, aplicando filtro se necessário
function carregarAulas(salaSelecionada = "todas") {
    const tbody = document.querySelector('.aulas-table tbody');
    tbody.innerHTML = "";

    const aulasFiltradas = salaSelecionada === "todas"
        ? aulas
        : aulas.filter(a => a.sala === salaSelecionada);

    aulasFiltradas.forEach((aula, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${aula.horario}</td>
            <td>${aula.disciplina}</td>
            <td>${aula.sala}</td>
            <td class="status">${aula.status}</td>
            <td class="acoes">
                ${
                    aula.status === "Pendente"
                        ? `<button class="btn-aceitar" data-index="${index}">Aceitar</button>
                           <button class="btn-recusar" data-index="${index}">Recusar</button>`
                        : "-"
                }
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Adicionar eventos aos botões
    document.querySelectorAll('.btn-aceitar').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = btn.getAttribute('data-index');
            aulas[i].status = "Confirmada";
            carregarAulas(salaSelecionada);
        });
    });

    document.querySelectorAll('.btn-recusar').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = btn.getAttribute('data-index');
            aulas[i].status = "Recusada";
            carregarAulas(salaSelecionada);
        });
    });
}


// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    carregarSalas();
    carregarAulas();

    const filtro = document.getElementById('filtroSala');
    filtro.addEventListener('change', () => {
        carregarAulas(filtro.value);
    });
});
