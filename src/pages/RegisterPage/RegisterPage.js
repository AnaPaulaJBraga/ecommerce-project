import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './RegisterPage.css';
import logoImage from '../../assets/LOGO_INFOWORD.png';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });

  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    senha: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({
      nome: '',
      email: '',
      senha: '',
    });
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
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        setMessage('Erro ao cadastrar. Tente novamente.');
      }
    }
  };

  return (
    <div className="container">
      <img src={logoImage} alt="Logo InfoWord" />

      <h1>Cadastre-se</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Digite seu nome"
          />
          {errors.nome && <p>{errors.nome}</p>}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Digite seu email"
          />
          {errors.email && <p>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Digite sua senha"
          />
          {errors.senha && <p>{errors.senha}</p>}
        </div>

        <button type="submit">Cadastrar</button>
      </form>

      {message && (
        <p
          className={`message ${
            message.includes('sucesso') ? 'success' : 'error'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default RegisterPage;
