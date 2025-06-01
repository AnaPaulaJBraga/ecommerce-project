import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './LoginPage.css';
import logo from '../../assets/LOGO_INFOWORD.png';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [errors, setErrors] = useState({ email: '', senha: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', senha: '' });
    setMessage('');

    let hasErrors = false;
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: 'Insira um email' }));
      hasErrors = true;
    }
    if (!formData.senha) {
      setErrors((prev) => ({ ...prev, senha: 'Insira uma senha' }));
      hasErrors = true;
    }

    if (!hasErrors) {
      try {
        await api.post('/login', formData);
        setMessage('Login realizado com sucesso!');
        setTimeout(() => navigate('/'), 2000);
      } catch (error) {
        setMessage('Erro ao fazer login. Verifique suas credenciais.');
      }
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
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}

            <input
              type="password"
              name="senha"
              placeholder="Digite sua senha"
              value={formData.senha}
              onChange={handleChange}
            />
            {errors.senha && <p className="error-msg">{errors.senha}</p>}

            <button type="submit">Entrar</button>
          </form>

          {message && (
            <p className={`login-message ${message.includes('sucesso') ? 'success' : 'error'}`}>
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
