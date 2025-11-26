document.addEventListener("DOMContentLoaded", () => {
    const studentTableBody = document.querySelector('#student-table-body');
    const searchInput = document.getElementById('student-search');
    const courseSelect = document.getElementById('course-filter');

    // Referências aos novos elementos do painel de resumo
    const totalStudentsEl = document.getElementById('total-students');
    const studentsByClassEl = document.getElementById('students-by-class');

    let studentsData = [];

    async function loadStudents() {
        try {
            const response = await fetch('js/gerenciar-alunos.json');
            if (!response.ok) {
                throw new Error('Erro ao carregar a lista de alunos.');
            }
            studentsData = await response.json();
            renderStudents(studentsData);
            renderSummary(studentsData); // Chama a função para renderizar o resumo
        } catch (error) {
            console.error('Erro ao carregar os alunos:', error);
            studentTableBody.innerHTML = '<tr><td colspan="4">Erro ao carregar a lista de alunos.</td></tr>';
        }
    }

    function renderStudents(students) {
        studentTableBody.innerHTML = '';
        if (students.length === 0) {
            studentTableBody.innerHTML = '<tr><td colspan="4">Nenhum aluno encontrado.</td></tr>';
            return;
        }
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.rm}</td>
                <td>${student.nome}</td>
                <td>${student.turma}</td>
                <td>
                    <button class="edit-btn" data-rm="${student.rm}">Editar</button> 
                    <button class="delete-btn" data-rm="${student.rm}">Excluir</button>
                </td>
            `;
            studentTableBody.appendChild(row);
        });
    }

    function filterAndDisplayStudents() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCourse = courseSelect.value.toLowerCase();

        const filteredStudents = studentsData.filter(student => {
            const nameMatch = student.nome.toLowerCase().includes(searchTerm);
            const rmMatch = student.rm.includes(searchTerm);
            const courseMatch = selectedCourse === 'todos' || student.turma.toLowerCase() === selectedCourse;

            return (nameMatch || rmMatch) && courseMatch;
        });
        renderStudents(filteredStudents);
        renderSummary(filteredStudents);
    }

    // Função para atualizar o painel de resumo
    function renderSummary(students) {
        totalStudentsEl.textContent = students.length;

        const informaticsCount = students.filter(s => s.turma.toLowerCase() === 'informatica').length;
        const enfermagemCount = students.filter(s => s.turma.toLowerCase() === 'enfermagem').length;

        studentsByClassEl.innerHTML = `
            <li>Informática: ${informaticsCount}</li>
            <li>Enfermagem: ${enfermagemCount}</li>
        `;
    }

    // Delegação de eventos para os botões editar e excluir
    studentTableBody.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('edit-btn')) {
            const rm = target.dataset.rm;
            alert(`Editar aluno com RM: ${rm}`);
            // Aqui você pode abrir seu modal para editar
        }

        if (target.classList.contains('delete-btn')) {
            const rm = target.dataset.rm;
            if (confirm(`Deseja excluir o aluno com RM ${rm}?`)) {
                // Remove o aluno do array
                studentsData = studentsData.filter(student => student.rm !== rm);
                // Atualiza a tabela e o resumo
                filterAndDisplayStudents();
            }
        }
    });

    // Listeners para pesquisa e filtro
    searchInput.addEventListener('input', filterAndDisplayStudents);
    courseSelect.addEventListener('change', filterAndDisplayStudents);

    // Carregar alunos inicialmente
    loadStudents();
});
