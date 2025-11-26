document.addEventListener("DOMContentLoaded", () => {
    const attendanceTableBody = document.querySelector('#attendance-table tbody');
    const recordsTableBody = document.querySelector('#records-table tbody');
    const studentInfoPanel = document.getElementById('student-info-panel');
    const saveButton = document.getElementById('save-attendance-btn');
    const courseSelect = document.getElementById('course-select');
    
    // ⭐️ NOVO ELEMENTO: Botão de Fechar Painel ⭐️
    const closePanelButton = document.getElementById('close-panel-btn');

    let studentsData = [];
    let attendanceRecords = []; // ⭐️ AGORA COMEÇA VAZIA ⭐️

    // -----------------------------------------------------------
    // LÓGICA DE CARREGAMENTO E FILTRO DE ALUNOS (MANTIDA)
    // -----------------------------------------------------------

    async function loadStudents() {
        try {
            // Carrega os dados dos alunos (com as turmas A e B)
            const response = await fetch('js/dados-alunos.json'); 
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados dos alunos.');
            }
            studentsData = await response.json();
            
            // Carrega a tabela com o valor inicial do dropdown
            renderStudents(courseSelect.value); 
        } catch (error) {
            console.error('Erro ao carregar os alunos:', error);
            attendanceTableBody.innerHTML = '<tr><td colspan="3">Erro ao carregar a lista de alunos.</td></tr>';
        }
    }

    function renderStudents(filtroTurma) {
        attendanceTableBody.innerHTML = '';
        
        const alunosFiltrados = studentsData.filter(student => {
            return filtroTurma === 'todos' || student.turma === filtroTurma; 
        });

        if (alunosFiltrados.length === 0) {
             attendanceTableBody.innerHTML = '<tr><td colspan="3">Nenhum aluno encontrado para a turma selecionada.</td></tr>';
             return;
        }

        alunosFiltrados.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-id="${student.id}" class="student-name">${student.nome}</td>
                <td>
                    <input type="checkbox" class="attendance-checkbox">
                </td>
                <td>
                    <input type="text" value="${student.observacoes || ''}" data-id="${student.id}" class="observacoes-input">
                </td>
            `;
            attendanceTableBody.appendChild(row);
        });
        attachClickEvents();
    }
    
    if (courseSelect) {
        courseSelect.addEventListener('change', (event) => {
            const turmaSelecionada = event.target.value;
            renderStudents(turmaSelecionada); 
            studentInfoPanel.classList.remove('active');
        });
    }

    // ⭐️ NOVA FUNÇÃO: Esconder o Painel ⭐️
    function hidePanel() {
        studentInfoPanel.classList.remove('active');
    }

    // Função para exibir o painel (mantida)
    function showPanel(studentId) {
        const student = studentsData.find(s => s.id === studentId);
        if (!student) return;

        document.getElementById('panel-photo').src = student.foto || 'img/default-avatar.png';
        document.getElementById('panel-name').textContent = student.nome;
        document.getElementById('panel-specs').textContent = `Especificações: ${student.especificacoes}`;
        document.getElementById('panel-notes').textContent = `Observações: ${student.observacoes}`;

        studentInfoPanel.classList.add('active');
    }

    function attachClickEvents() {
        const studentNameCells = document.querySelectorAll('.student-name');
        studentNameCells.forEach(cell => {
            const studentId = cell.getAttribute('data-id');
            cell.addEventListener('click', () => showPanel(studentId));
        });
        
        // ⭐️ NOVO EVENTO: Fechar o Painel ao clicar no 'X' ⭐️
        if (closePanelButton) {
            closePanelButton.addEventListener('click', hidePanel);
        }
    }
    
    // -----------------------------------------------------------
    // LÓGICA DE REGISTRO DE PRESENÇAS (AJUSTADA)
    // -----------------------------------------------------------

    // ⭐️ FUNÇÃO renderAttendanceRecords (MANTIDA) ⭐️
    function renderAttendanceRecords() {
        recordsTableBody.innerHTML = '';
        if (attendanceRecords.length === 0) {
            recordsTableBody.innerHTML = '<tr><td colspan="3">Ainda não há registros de presença salvos nesta sessão.</td></tr>';
            return;
        }
        
        // Renderiza apenas os registros que estão no array attendanceRecords
        attendanceRecords.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.aluno}</td>
                <td>${record.status}</td>
                <td>${record.data}</td>
            `;
            recordsTableBody.appendChild(row);
        });
    }
    
    saveButton.addEventListener('click', () => {
        const newRecords = [];
        // Pega apenas as linhas que estão visíveis após o filtro
        const attendanceRows = document.querySelectorAll('#attendance-table tbody tr'); 
        const currentDate = new Date().toLocaleDateString('pt-BR');

        attendanceRows.forEach(row => {
            const studentNameElement = row.querySelector('.student-name');
            const studentName = studentNameElement ? studentNameElement.textContent.trim() : 'Nome Desconhecido';
            const checkbox = row.querySelector('.attendance-checkbox');
            const presenceStatus = checkbox ? (checkbox.checked ? 'Presente' : 'Faltou') : 'Não Verificado';

            newRecords.push({
                aluno: studentName,
                status: presenceStatus,
                data: currentDate
            });
        });

        // Adiciona os NOVOS registros à variável attendanceRecords
        attendanceRecords = attendanceRecords.concat(newRecords);
        
        // Renderiza a tabela de registros APENAS COM O QUE FOI SALVO
        renderAttendanceRecords(); 
        
        alert("Presenças salvas com sucesso! Veja o registro abaixo.");
    });
    
    // -----------------------------------------------------------
    // INICIALIZAÇÃO
    // -----------------------------------------------------------
    
    loadStudents();
    
    // CHAMADA INICIAL: A tabela de registros é renderizada VAZIA
    renderAttendanceRecords(); 
});
