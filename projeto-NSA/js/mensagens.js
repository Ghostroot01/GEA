document.addEventListener("DOMContentLoaded", () => {
    const messageForm = document.getElementById('new-message-form');
    const messagesList = document.getElementById('messages-list');
    const messageTitleInput = document.getElementById('message-title');
    const messageContentInput = document.getElementById('message-content');

    let messagesData = [];

    // Função para carregar as mensagens do arquivo JSON
    async function loadMessages() {
        try {
            const response = await fetch('js/mensagens.json');
            messagesData = await response.json();
            renderMessages();
        } catch (error) {
            console.error('Erro ao carregar as mensagens:', error);
            messagesList.innerHTML = '<p>Erro ao carregar o mural de mensagens.</p>';
        }
    }

    // Função para renderizar as mensagens na página
    function renderMessages() {
        messagesList.innerHTML = ''; // Limpa a lista
        if (messagesData.length === 0) {
            messagesList.innerHTML = '<p>Nenhuma mensagem publicada ainda.</p>';
            return;
        }

        // Renderiza as mensagens da mais recente para a mais antiga
        messagesData.slice().reverse().forEach(message => {
            const messageItem = document.createElement('div');
            messageItem.classList.add('message-item');
            messageItem.innerHTML = `
                <h4>${message.titulo}</h4>
                <p>${message.conteudo}</p>
                <p class="message-date">Publicado em: ${message.data}</p>
            `;
            messagesList.appendChild(messageItem);
        });
    }

    // Função para lidar com o envio do formulário
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = messageTitleInput.value;
        const content = messageContentInput.value;
        const currentDate = new Date().toLocaleDateString('pt-BR');

        const newMessage = {
            titulo: title,
            conteudo: content,
            data: currentDate
        };

        // Adiciona a nova mensagem ao array (simulando um salvamento)
        messagesData.push(newMessage);
        renderMessages();

        // Limpa o formulário
        messageTitleInput.value = '';
        messageContentInput.value = '';
    });

    // Carrega as mensagens ao iniciar a página
    loadMessages();
});