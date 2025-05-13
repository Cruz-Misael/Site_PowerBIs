import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../assets/logo_personalizado.png'; // Importando a imagem do logo
const API_BASE_URL = process.env.REACT_APP_API_URL;

//testando pull request de outras máquinas.

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const navigate = useNavigate();

  // Função de validação memoizada
  const validateEmail = useCallback((email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, []);

  const validatePassword = (password) => {
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
  };

  // Verificação de email otimizada
  const checkEmailExists = useCallback(async (emailToCheck) => {
    if (!emailToCheck || !validateEmail(emailToCheck)) return;
    
    setIsCheckingEmail(true);
    try {
      const response = await fetch(`${API_BASE_URL}/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToCheck })
      });

      if (!response.ok) throw new Error('Erro ao verificar email');

      const data = await response.json();
      if (!data.exists) {
        setErrorMessage('Este email não está registrado.');
      } else {
        setErrorMessage('');
      }
    } catch (err) {
      console.error("Erro ao verificar email:", err);
      setErrorMessage('Erro ao verificar email. Tente novamente.');
    } finally {
      setIsCheckingEmail(false);
    }
  }, [validateEmail]);

  const handleEmailBlur = (e) => {
    const currentEmail = e.target.value;
    checkEmailExists(currentEmail);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setErrorMessage('Por favor, insira um e-mail válido.');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('A senha deve ter pelo menos 8 caracteres, incluindo números, letras maiúsculas, minúsculas e caracteres especiais.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      // Armazena apenas o necessário no localStorage
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('accessLevel', data.user.accessLevel);
      localStorage.setItem('team', data.user.team);

      setSuccessMessage('Login bem-sucedido! Redirecionando...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error("Erro ao processar login:", err);
      setErrorMessage(err.message || 'Erro ao conectar ao servidor.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" />
      <h2>Acesse sua conta</h2>
      
      <form onSubmit={handleLogin}>
        <div className="form-field">
          <div className="label">
            <label>Email:</label>
          </div>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            placeholder="Digite seu email" 
            required
            disabled={isCheckingEmail}
          />
        </div>
        
        <div className="form-field">
          <div className="label">
            <label>Senha:</label>
          </div>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha" 
            required
          />
        </div>
        
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        
        <button 
          type="submit" 
          className="login-button"
          disabled={isCheckingEmail}
        >
          {isCheckingEmail ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
      
      <button 
        className="register-button" 
        onClick={handleRegister}
        disabled={isCheckingEmail}
      >
        Registrar-se
      </button>
    </div>
  );
};

export default Login;