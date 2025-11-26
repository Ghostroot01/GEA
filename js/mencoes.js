document.addEventListener("DOMContentLoaded", () => {
    const mentionsList = document.getElementById('mentions-list');

    let mentionsData = [];

    // Função para carregar as menções do arquivo JSON
    async function loadMentions() {
        try {
            const response = await fetch('js/mencoes.json');
            if (!response.ok) {
                if (response.status === 404) {
                    mentionsData = [];
                    renderMentions();
                    return;
                }
                throw new Error('Network response was not ok.');
            }
            mentionsData = await response.json();
            renderMentions();
        } catch (error) {
            console.error('Erro ao carregar as menções:', error);
            mentionsList.innerHTML = '<p>Erro ao carregar a lista de menções.</p>';
        }
    }

    // Função para renderizar as menções na página
    function renderMentions() {
        mentionsList.innerHTML = '';
        if (mentionsData.length === 0) {
            mentionsList.innerHTML = '<p>Você não tem menções ou notificações no momento.</p>';
            return;
        }

        mentionsData.forEach(mention => {
            const mentionItem = document.createElement('div');
            mentionItem.classList.add('mention-item');
            mentionItem.innerHTML = `
                <h4>${mention.titulo}</h4>
                <p>${mention.conteudo}</p>
                <span class="mention-date">Data: ${mention.data}</span>
            `;
            mentionsList.appendChild(mentionItem);
        });
    }

    loadMentions();
});