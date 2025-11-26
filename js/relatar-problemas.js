document.addEventListener("DOMContentLoaded", () => {
    const problemForm = document.getElementById('problem-form');
    const problemsList = document.getElementById('problems-list');

    let problemsData = [];

    // Função para carregar os problemas do arquivo JSON
    async function loadProblems() {
        try {
            const response = await fetch('js/relatar-problemas.json');
            if (!response.ok) {
                if (response.status === 404) {
                    problemsData = [];
                    renderProblems();
                    return;
                }
                throw new Error('Network response was not ok.');
            }
            problemsData = await response.json();
            renderProblems();
        } catch (error) {
            console.error('Erro ao carregar os problemas:', error);
            problemsList.innerHTML = '<p>Erro ao carregar a lista de problemas.</p>';
        }
    }

    // Função para renderizar os problemas na página
    function renderProblems() {
        problemsList.innerHTML = '';
        if (problemsData.length === 0) {
            problemsList.innerHTML = '<p>Nenhum problema relatado ainda.</p>';
            return;
        }

        problemsData.forEach(problem => {
            const problemItem = document.createElement('div');
            problemItem.classList.add('problem-item');
            problemItem.innerHTML = `
                <h4>${problem.titulo}</h4>
                <p><strong>Tipo:</strong> ${problem.tipo}</p>
                <p>${problem.descricao}</p>
                <span class="problem-details">Enviado em: ${problem.dataEnvio}</span>
            `;
            problemsList.appendChild(problemItem);
        });
    }

    // Lida com o envio do formulário
    problemForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newProblem = {
            tipo: document.getElementById('problem-type').value,
            titulo: document.getElementById('problem-title').value,
            descricao: document.getElementById('problem-description').value,
            dataEnvio: new Date().toLocaleDateString('pt-BR')
        };

        problemsData.push(newProblem);
        renderProblems();
        problemForm.reset();
    });

    loadProblems();
});