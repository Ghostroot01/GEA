document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o envio do formulário e o recarregamento da página

        // Credenciais de exemplo (vários usuários)
        const usuarios = {
            professor: {
                senha: 'senha123',
                pagina: 'professor.html'
            },
            aluno: {
                senha: 'senha123',
                pagina: 'index.html' // Redireciona o aluno para index.html
            }
        };

        const usuarioDigitado = document.getElementById('username').value.trim();
        const senhaDigitada = document.getElementById('password').value.trim();

        // Verifica se o usuário existe e a senha está correta
        if (usuarios[usuarioDigitado] && senhaDigitada === usuarios[usuarioDigitado].senha) {
            alert(`Login bem-sucedido! Redirecionando para o painel de ${usuarioDigitado}.`);
            window.location.href = usuarios[usuarioDigitado].pagina;
        } else {
            alert('Usuário ou senha incorretos. Por favor, tente novamente.');
        }
    });
});
