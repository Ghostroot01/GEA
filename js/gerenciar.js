document.addEventListener("DOMContentLoaded", () => {
    const studentTableBody = document.getElementById('student-table-body');
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');
    const modalContent = document.getElementById('modal-content');

    let studentsData = [];

    async function loadStudentsData() {
        try {
            const response = await fetch('js/alunos.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            studentsData = await response.json();
            renderStudentsTable(studentsData);
        } catch (error) {
            console.error('Erro ao carregar os dados dos alunos:', error);
            studentTableBody.innerHTML = '<tr><td colspan="4">Erro ao carregar a lista de alunos.</td></tr>';
        }
    }

    function renderStudentsTable(data) {
        studentTableBody.innerHTML = '';
        if (data.length === 0) {
            studentTableBody.innerHTML = '<tr><td colspan="4">Nenhum aluno encontrado.</td></tr>';
            return;
        }

        data.forEach(student => {
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
        addEventListenersToButtons();
    }

    function addEventListenersToButtons() {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const studentRm = e.target.dataset.rm;
                openModal('edit', studentRm);
            });
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const studentRm = e.target.dataset.rm;
                openModal('delete', studentRm);
            });
        });
    }

    function openModal(action, rm) {
        modalOverlay.style.display = 'flex';
        const student = studentsData.find(s => s.rm === rm);
        if (!student) {
            modalContent.innerHTML = `<p>Aluno não encontrado.</p>`;
            return;
        }

        if (action === 'edit') {
            modalContent.innerHTML = `
                <div class="edit-form">
                    <h3>Editar Aluno: ${student.nome}</h3>
                    <div class="form-group">
                        <label for="edit-name">Nome do Aluno:</label>
                        <input type="text" id="edit-name" value="${student.nome}">
                    </div>
                    <div class="form-group">
                        <label for="edit-class">Turma:</label>
                        <input type="text" id="edit-class" value="${student.turma}">
                    </div>
                    <button id="save-edit-btn" data-rm="${student.rm}">Salvar</button>
                </div>
            `;
            // Adiciona o evento de clique ao novo botão "Salvar"
            document.getElementById('save-edit-btn').addEventListener('click', saveEditedStudent);
        } else if (action === 'delete') {
            modalContent.innerHTML = `
                <div class="delete-confirmation">
                    <h3>Confirmar Exclusão</h3>
                    <p>Tem certeza de que deseja excluir o aluno <strong>${student.nome}</strong>?</p>
                    <button id="confirm-delete-btn" data-rm="${student.rm}">Sim, Excluir</button>
                </div>
            `;
            // Adiciona o evento de clique ao novo botão "Sim, Excluir"
            document.getElementById('confirm-delete-btn').addEventListener('click', deleteStudent);
        }
    }

    function closeModal() {
        modalOverlay.style.display = 'none';
    }

    function saveEditedStudent(e) {
        const rmToEdit = e.target.dataset.rm;
        const newName = document.getElementById('edit-name').value;
        const newClass = document.getElementById('edit-class').value;

        const studentIndex = studentsData.findIndex(s => s.rm === rmToEdit);
        if (studentIndex !== -1) {
            studentsData[studentIndex].nome = newName;
            studentsData[studentIndex].turma = newClass;
            renderStudentsTable(studentsData);
            closeModal();
        }
    }

    function deleteStudent(e) {
        const rmToDelete = e.target.dataset.rm;
        const studentIndex = studentsData.findIndex(s => s.rm === rmToDelete);
        if (studentIndex !== -1) {
            studentsData.splice(studentIndex, 1);
            renderStudentsTable(studentsData);
            closeModal();
        }
    }

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            closeModal();
        }
    });

    loadStudentsData();
});