const API_BASE_URL = 'https://us-central1-sebratel-tecnologia.cloudfunctions.net/api';
console.log('v_0.0.2')
// Adiciona o evento de submit ao formulário
document.getElementById('login-form').addEventListener('submit', handleLogin);


function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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

// Função para lidar com o login
function handleLogin(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessageElement = document.getElementById('error-message');
    const successMessageElement = document.getElementById('success-message');

    if (!validateEmail(email)) {
        errorMessageElement.textContent = 'Por favor, insira um e-mail válido.';
        errorMessageElement.style.display = 'block';
        return;
    }

    if (!validatePassword(password)) {
        errorMessageElement.textContent = 'A senha deve ter pelo menos 8 caracteres, incluindo números, letras maiúsculas, minúsculas e caracteres especiais.';
        errorMessageElement.style.display = 'block';
        return;
    }

    // Limpa mensagens anteriores
    errorMessageElement.style.display = 'none';
    errorMessageElement.textContent = '';
    successMessageElement.style.display = 'none';
    successMessageElement.textContent = '';

    // Envia os dados de login para o backend
    fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        console.log("Status da resposta:", response.status);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Salva os dados do usuário no localStorage
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('accessLevel', data.user.accessLevel);
            localStorage.setItem('team', data.user.team);

            successMessageElement.textContent = 'Login bem-sucedido! Redirecionando...';
            successMessageElement.style.display = 'block';
            setTimeout(() => window.location.href = 'dashboard.html', 1000); // Redireciona após 1s
        } else {
            errorMessageElement.textContent = data.message || 'Email ou senha inválidos.';
            errorMessageElement.style.display = 'block';
        }
    })
    .catch(err => {
        console.error("Erro ao processar login:", err);
        errorMessageElement.textContent = 'Erro ao conectar ao servidor.';
        errorMessageElement.style.display = 'block';
    });
}

// Função para verificar se o email existe no banco de dados
function checkEmailExists() {
    const email = document.getElementById('email').value;
    const errorMessageElement = document.getElementById('error-message');

    if (!email) return; // Sai se o campo estiver vazio

    fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(users => {
        const emailExists = users.some(u => u.email === email);
        if (!emailExists) {
            errorMessageElement.textContent = 'Este email não está registrado.';
            errorMessageElement.style.display = 'block';
        } else {
            errorMessageElement.style.display = 'none';
        }
    })
    .catch(err => {
        console.error("Erro ao verificar email:", err);
        errorMessageElement.textContent = 'Erro ao verificar email.';
        errorMessageElement.style.display = 'block';
    });
}

// Função para redirecionar para a página de cadastro
function handleRegister() {
    console.log("Redirecionando para cadastro.html...");
    window.location.href = 'cadastro.html';
}