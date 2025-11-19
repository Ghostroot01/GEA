document.addEventListener("DOMContentLoaded", () => {
    const appointmentForm = document.getElementById('new-appointment-form');
    const appointmentsList = document.getElementById('appointments-list');

    let appointmentsData = [];

    // Função para carregar os agendamentos do arquivo JSON
    async function loadAppointments() {
        try {
            const response = await fetch('js/agendamentos.json');
            if (!response.ok) {
                // Se o arquivo não existir, inicia com um array vazio.
                if (response.status === 404) {
                    appointmentsData = [];
                    renderAppointments();
                    return;
                }
                throw new Error('Network response was not ok.');
            }
            appointmentsData = await response.json();
            renderAppointments();
        } catch (error) {
            console.error('Erro ao carregar os agendamentos:', error);
            appointmentsList.innerHTML = '<p>Erro ao carregar a lista de agendamentos.</p>';
        }
    }

    // Função para renderizar os agendamentos na página
    function renderAppointments() {
        appointmentsList.innerHTML = '';
        if (appointmentsData.length === 0) {
            appointmentsList.innerHTML = '<p>Nenhum agendamento futuro.</p>';
            return;
        }

        // Ordena os agendamentos por data e hora
        const sortedAppointments = appointmentsData.sort((a, b) => {
            const dateA = new Date(`${a.data}T${a.hora}`);
            const dateB = new Date(`${b.data}T${b.hora}`);
            return dateA - dateB;
        });

        sortedAppointments.forEach(appointment => {
            const appointmentItem = document.createElement('div');
            appointmentItem.classList.add('appointment-item');
            appointmentItem.innerHTML = `
                <h4>${appointment.titulo}</h4>
                <p>Participantes: ${appointment.participantes || 'N/A'}</p>
                <p>Descrição: ${appointment.descricao || 'N/A'}</p>
                <p class="appointment-details">Data: ${appointment.data} | Hora: ${appointment.hora}</p>
            `;
            appointmentsList.appendChild(appointmentItem);
        });
    }

    // Lida com o envio do formulário
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newAppointment = {
            titulo: document.getElementById('appointment-title').value,
            data: document.getElementById('appointment-date').value,
            hora: document.getElementById('appointment-time').value,
            participantes: document.getElementById('appointment-attendees').value,
            descricao: document.getElementById('appointment-description').value,
            criadoEm: new Date().toISOString()
        };

        appointmentsData.push(newAppointment);
        renderAppointments();
        appointmentForm.reset();
    });

    loadAppointments();
});