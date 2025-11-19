document.addEventListener("DOMContentLoaded", () => {
    // 1. CARREGAMENTO DE DADOS E VARIÁVEIS
    const data = window.professor;

    // Elementos da página
    const professorName = document.getElementById('professor-name');
    const professorCode = document.getElementById('professor-code');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    // TODAS as seções que o JS deve gerenciar (o novo conteúdo)
    const contentSections = document.querySelectorAll('.content-section');
    
    // Seções da TELA INICIAL (que devem aparecer por padrão)
    const homeSections = document.querySelectorAll('.messages-section, .notifications-section');

    // ---------------------------------------------------------------------
    // 2. FUNÇÃO: Popula as aulas programadas (CÓDIGO DA AULA DO DIA)
    // ---------------------------------------------------------------------
    function populateAulas(aulasData) {
        const aulasSection = document.getElementById('aulas-programadas-section');
        if (!aulasSection) return;

        aulasSection.innerHTML = '<h3>Minhas Aulas Programadas</h3>';

        if (aulasData && aulasData.length > 0) {
            const table = document.createElement('table');
            table.classList.add('schedule-table'); 
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Horário</th>
                        <th>Disciplina</th>
                        <th>Turma</th>
                        <th>Sala</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;
            const tbody = table.querySelector('tbody');

            aulasData.forEach(aula => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${aula.horario}</td>
                    <td>${aula.disciplina}</td>
                    <td>${aula.turma}</td>
                    <td>${aula.sala}</td>
                `;
                tbody.appendChild(row);
            });
            aulasSection.appendChild(table);
        } else {
            aulasSection.innerHTML += '<p>Nenhuma aula programada para hoje.</p>';
        }
    }

    // ---------------------------------------------------------------------
    // 3. FUNÇÕES: Gerenciam a troca de conteúdo (SPA)
    // ---------------------------------------------------------------------
    function showContent(sectionId) {
        // Esconde TODAS as seções
        contentSections.forEach(section => section.style.display = 'none');
        homeSections.forEach(section => section.style.display = 'none'); 

        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
            targetSection.style.display = 'block';

            // Chamada com verificação tripla: Seção correta, objeto 'data' existe, e 'aulasDoDia' existe.
            if (sectionId === 'aulas-programadas-section') {
                const aulasData = window.professor ? window.professor.aulasDoDia : null;
                
                if (aulasData) {
                    populateAulas(aulasData);
                } else {
                    // Mensagem de erro que você viu
                    targetSection.innerHTML = '<h3>Erro ao carregar dados!</h3><p>Verifique o arquivo js/dados-prof.js.</p>';
                }
            }
        }
    }
    
    function showHome() {
        // Esconde o conteúdo dinâmico
        contentSections.forEach(section => section.style.display = 'none');
        
        // Mostra as seções padrão da tela inicial
        document.querySelector('.messages-section').style.display = 'block';
        document.querySelector('.notifications-section').style.display = 'grid'; // Ou 'block', dependendo do seu CSS original
    }


    // ---------------------------------------------------------------------
    // 4. INICIALIZAÇÃO E EVENT LISTENERS
    // ---------------------------------------------------------------------
    if (data) {
        // Preenche as informações do professor no sidebar
        if (professorName) professorName.textContent = data.nome;
        if (professorCode) professorCode.textContent = data.codigo;
    }

    // Configura os cliques nos links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = e.target.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault(); 
                const sectionId = href.substring(1);
                
                // Trata o clique no link de Início (que tem href="#")
                if (href === '#') {
                    showHome();
                } else {
                    showContent(sectionId);
                }
            }
        });
    });

    // Estado inicial: mostra a seção com base no hash OU a tela inicial
    const initialSection = window.location.hash.substring(1);
    if (initialSection) {
        showContent(initialSection);
    } else {
        showHome(); 
    }
});