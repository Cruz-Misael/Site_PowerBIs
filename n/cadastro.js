const API_BASE_URL = 'https://us-central1-sebratel-tecnologia.cloudfunctions.net/api'//process.env.REACT_APP_API_URL;

let isEmailRegistered = false; // Variável para verificar se o e-mail já tem senha

// Função para verificar se o e-mail já tem uma senha associada
function checkEmailExists() {
    const email = document.getElementById('email').value;
    const errorMessageElement = document.getElementById('error-message');

    fetch(`${API_BASE_URL}/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    })
    .then(response => response.json())
    .then(data => {
        isEmailRegistered = data.exists;
        if (data.exists) {
            errorMessageElement.textContent = 'Este e-mail já possui uma senha registrada.';
            errorMessageElement.style.display = 'block';
        } else {
            errorMessageElement.style.display = 'none';
        }
    })
    .catch(err => {
        console.error(err);
        errorMessageElement.textContent = 'Erro ao verificar o e-mail.';
        errorMessageElement.style.display = 'block';
    });
}

function validatePassword(password) {
    const minLength = 8;
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        password.length >= minLength &&
        hasNumber &&
        hasUpperCase &&
        hasLowerCase &&
        hasSpecialChar
    );
}

// Função para lidar com a alteração da senha
function handleChangePassword() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessageElement = document.getElementById('error-message');
    const successMessageElement = document.getElementById('success-message');

    if (!validatePassword(password)) {
        errorMessageElement.textContent = 'A senha deve ter pelo menos 8 caracteres, incluindo números, letras maiúsculas, minúsculas e caracteres especiais.';
        errorMessageElement.style.display = 'block';
        return;
    }
    
    // Limpa mensagens anteriores
    errorMessageElement.style.display = 'none';
    successMessageElement.style.display = 'none';

    if (isEmailRegistered) {
        errorMessageElement.textContent = 'Este e-mail já possui uma senha registrada. Não é possível alterá-la.';
        errorMessageElement.style.display = 'block';
        return;
    }

    if (password !== confirmPassword) {
        errorMessageElement.textContent = 'As senhas não coincidem!';
        errorMessageElement.style.display = 'block';
        return;
    }

    fetch(`${API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            successMessageElement.textContent = 'Senha alterada com sucesso!';
            successMessageElement.style.display = 'block';
            // Redireciona para a página de login após 2 segundos
            setTimeout(() => window.location.href = 'index.html', 2000);
        } else {
            errorMessageElement.textContent = data.message;
            errorMessageElement.style.display = 'block';
        }
    })
    .catch(err => {
        console.error(err);
        errorMessageElement.textContent = 'Erro ao alterar a senha.';
        errorMessageElement.style.display = 'block';
    });
}

// Função para voltar à página de login
function handleBackToLogin() {
    window.location.href = 'index.html'; // Ajuste o destino conforme necessário
}