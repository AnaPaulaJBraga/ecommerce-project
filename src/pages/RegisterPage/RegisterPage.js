import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './RegisterPage.css';
import logo from '../../assets/LOGO_INFOWORD.png';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const [errors, setErrors] = useState({ nome: '', email: '', senha: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({ nome: '', email: '', senha: '' });
    setMessage('');

    let hasErrors = false;
    if (!formData.nome) {
      setErrors((prev) => ({ ...prev, nome: 'Insira um nome' }));
      hasErrors = true;
    }
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
        await api.post('/usuarios', {
          usuario: {
            nome: formData.nome,
            email: formData.email,
            senha: formData.senha,
          },
        });

        await api.post('/login', {
          email: formData.email,
          senha: formData.senha,
        });

        setMessage('Cadastrado e logado com sucesso!');
        setTimeout(() => navigate('/'), 2000);
      } catch (error) {
        setMessage('Erro ao cadastrar. Tente novamente.', error);
      }
    }
  };

  return (
    <>
      <Header />
      <main className="register-wrapper">
        <div className="register-box">
          <img src={logo} alt="Logo InfoWord" className="register-logo" />
          <h1>Cadastre-se</h1>

          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="nome"
              placeholder="Digite seu nome"
              value={formData.nome}
              onChange={handleChange}
            />
            {errors.nome && <p className="error-msg">{errors.nome}</p>}

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

            <button type="submit">Cadastrar</button>
          </form>

          {message && (
            <p
              className={`register-message ${message.includes('sucesso') ? 'success' : 'error'}`}
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

export default RegisterPage;
