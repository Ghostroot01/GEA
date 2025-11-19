document.addEventListener("DOMContentLoaded", () => {
    const btnAbrir = document.getElementById('btnAbrirModal');
    const modal = document.getElementById('modalNotas');
    const btnFechar = document.getElementById('fecharModal');
    const form = document.getElementById('notaForm');
    const tbody = document.querySelector('#tabelaNotas tbody');

    let notasSalvas = [];
    const dadosStorage = localStorage.getItem('notas');

    if (dadosStorage && dadosStorage !== '[]') {
        try {
            notasSalvas = JSON.parse(dadosStorage);
        } catch {
            notasSalvas = [];
        }
    }

    if (notasSalvas.length === 0) {
        notasSalvas = [
            { nome: "Ana Silva", nota: 8.5 },
            { nome: "Bruno Souza", nota: 7.0 },
            { nome: "Carlos Oliveira", nota: 9.2 }
        ];
    }

    atualizarTabela();

    btnAbrir.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    btnFechar.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if(event.target === modal){
            modal.style.display = 'none';
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nomeAluno').value.trim();
        const nota = parseFloat(document.getElementById('notaAluno').value);

        if (!nome || isNaN(nota)) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        notasSalvas.push({ nome, nota });
        localStorage.setItem('notas', JSON.stringify(notasSalvas));

        form.reset();
        atualizarTabela();
    });

    function atualizarTabela() {
        tbody.innerHTML = '';

        if (notasSalvas.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="3" style="text-align:center;">Nenhuma nota lançada ainda.</td>';
            tbody.appendChild(tr);
            return;
        }

        notasSalvas.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.nota}</td>
                <td><button class="excluir" data-index="${index}">Excluir</button></td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.excluir').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const i = e.target.getAttribute('data-index');
                notasSalvas.splice(i, 1);
                localStorage.setItem('notas', JSON.stringify(notasSalvas));
                atualizarTabela();
            });
        });
    }
});
