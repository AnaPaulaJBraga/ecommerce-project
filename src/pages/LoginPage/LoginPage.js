import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './LoginPage.css';
import logo from '../../assets/LOGO_INFOWORD.png';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Atualiza campos de input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Envia o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ username: '', password: '' });
    setMessage('');

    let hasErrors = false;
    if (!formData.username) {
      setErrors((prev) => ({
        ...prev,
        username: 'Insira seu nome de usuário',
      }));
      hasErrors = true;
    }
    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: 'Insira sua senha' }));
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      // Faz o login JWT no backend
      const response = await api.post('/token/', {
        username: formData.username,
        password: formData.password,
      });

      // Salva o token de acesso e refresh no localStorage
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      setMessage('Login realizado com sucesso!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Erro no login:', error);
      setMessage('Credenciais inválidas. Verifique e tente novamente.');
    }
  };

  return (
    <>
      <Header />
      <main className="login-wrapper">
        <div className="login-box">
          <img src={logo} alt="Logo InfoWord" className="login-logo" />
          <h1>Entrar na sua conta</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Nome de usuário"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="error-msg">{errors.username}</p>}

            <input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error-msg">{errors.password}</p>}

            <button type="submit">Entrar</button>
          </form>

          {message && (
            <p
              className={`login-message ${message.includes('sucesso') ? 'success' : 'error'}`}
            >
              {message}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LoginPage;
