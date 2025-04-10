
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/Register.css';
const API_BASE_URL = process.env.REACT_APP_API_URL;

const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailRegistered, setIsEmailRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const checkEmailExists = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      setIsEmailRegistered(data.exists);
      
      if (data.exists) {
        setErrorMessage('Este e-mail já possui uma senha registrada.');
      } else {
        setErrorMessage('');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao verificar o e-mail.');
    }
  };

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

  const handleChangePassword = async () => {
    // Validações
    if (!validatePassword(password)) {
      setErrorMessage('A senha deve ter pelo menos 8 caracteres, incluindo números, letras maiúsculas, minúsculas e caracteres especiais.');
      return;
    }
    
    if (isEmailRegistered) {
      setErrorMessage('Este e-mail já possui uma senha registrada. Não é possível alterá-la.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem!');
      return;
    }

    // Limpa mensagens anteriores
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Senha alterada com sucesso!');
        // Redireciona para a página de login após 2 segundos
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao alterar a senha.');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="page-cadastro-container">
      <button className="back-button" onClick={handleBackToLogin}>
         Voltar
      </button>
      
      <h2>Alterar Senha</h2>
      
      <div className="form-field">
        <label className="label">Email:</label>
        <input 
          type="email" 
          id="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={checkEmailExists}
          placeholder="Digite seu email"
        />
      </div>
      
      <div className="form-field">
        <label className="label">Nova Senha:</label>
        <input 
          type="password" 
          id="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a nova senha"
        />
      </div>
      
      <div className="form-field">
        <label className="label">Confirmar Senha:</label>
        <input 
          type="password" 
          id="confirmPassword" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirme a senha"
        />
      </div>
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      
      <button className="save-button" onClick={handleChangePassword}>
        Alterar Senha
      </button>
    </div>
  );
};

export default ChangePassword;