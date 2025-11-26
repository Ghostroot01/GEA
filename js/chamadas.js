document.addEventListener("DOMContentLoaded", () => {
    const attendanceTableBody = document.querySelector('#attendance-table tbody');
    const recordsTableBody = document.querySelector('#records-table tbody');
    const studentInfoPanel = document.getElementById('student-info-panel');
    const saveButton = document.getElementById('save-attendance-btn');
    const courseSelect = document.getElementById('course-select'); // ⭐️ NOVO: Seleção de Turma

    let studentsData = [];
    let attendanceRecords = [];

    // Função para carregar os dados dos alunos do arquivo JSON
    async function loadStudents() {
        try {
            // Assumindo que seu JSON está em 'js/dados-alunos.json'
            const response = await fetch('js/dados-alunos.json'); 
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados dos alunos.');
            }
            studentsData = await response.json();
            
            // ⭐️ ATENÇÃO: Carrega a tabela com o valor inicial do dropdown ('todos' ou 'turma-a')
            renderStudents(courseSelect.value); 
        } catch (error) {
            console.error('Erro ao carregar os alunos:', error);
            attendanceTableBody.innerHTML = '<tr><td colspan="3">Erro ao carregar a lista de alunos.</td></tr>';
        }
    }

    // ⭐️ FUNÇÃO AJUSTADA: Agora recebe o filtro de turma
    function renderStudents(filtroTurma) {
        attendanceTableBody.innerHTML = '';
        
        // Filtra os alunos
        const alunosFiltrados = studentsData.filter(student => {
            // O filtro verifica se o valor é 'todos' OU se a turma do aluno corresponde ao filtro
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
    
    // ⭐️ NOVO EVENTO DE ESCUTA PARA O DROPDOWN 
    if (courseSelect) {
        courseSelect.addEventListener('change', (event) => {
            const turmaSelecionada = event.target.value;
            renderStudents(turmaSelecionada); // Recarrega a tabela com o filtro
            studentInfoPanel.classList.remove('active'); // Esconde o painel lateral ao mudar de turma
        });
    }
    // FIM DO NOVO EVENTO ⭐️

    // Função para exibir o painel
    function showPanel(studentId) {
        const student = studentsData.find(s => s.id === studentId);
        if (!student) return;

        // Se você mudou o JSON para ter 'turma', use aqui:
        // document.getElementById('panel-specs').textContent = `Turma: ${student.turma}`;
        
        document.getElementById('panel-photo').src = student.foto || 'img/default-avatar.png';
        document.getElementById('panel-name').textContent = student.nome;
        document.getElementById('panel-specs').textContent = `Especificações: ${student.especificacoes}`;
        document.getElementById('panel-notes').textContent = `Observações: ${student.observacoes}`;

        studentInfoPanel.classList.add('active');
    }

    // Função para anexar o evento de clique
    function attachClickEvents() {
        const studentNameCells = document.querySelectorAll('.student-name');
        studentNameCells.forEach(cell => {
            const studentId = cell.getAttribute('data-id');
            cell.addEventListener('click', () => showPanel(studentId));
        });
    }

    // --- NOVA LÓGICA PARA REGISTRO DE PRESENÇAS (MANTIDA) ---
    async function loadAttendanceRecords() {
        try {
            const response = await fetch('js/registros-presenca.json');
            if (!response.ok) {
                throw new Error('Erro ao carregar os registros de presença.');
            }
            attendanceRecords = await response.json();
            renderAttendanceRecords();
        } catch (error) {
            console.error('Erro ao carregar os registros:', error);
            recordsTableBody.innerHTML = '<tr><td colspan="3">Nenhum registro encontrado.</td></tr>';
        }
    }

    function renderAttendanceRecords() {
        recordsTableBody.innerHTML = '';
        if (attendanceRecords.length === 0) {
            recordsTableBody.innerHTML = '<tr><td colspan="3">Nenhum registro encontrado.</td></tr>';
            return;
        }
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
        // Agora, só salvamos os registros da turma que está visível!
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

        attendanceRecords = attendanceRecords.concat(newRecords);
        renderAttendanceRecords();
        alert("Presenças salvas com sucesso!");
    });

    loadStudents();
    loadAttendanceRecords();
});