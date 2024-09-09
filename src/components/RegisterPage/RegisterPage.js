import React, { useState } from 'react';
import api from '../../api';

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

    // Basic validation
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
        const response = await api.post('/usuarios', {
          usuario: {
            nome: formData.nome,
            email: formData.email,
            senha: formData.senha,
          },
        });
        console.log('Cadastrado com sucesso:', response.data);
      } catch (error) {
        console.error('Erro:', error);
        // ADICIONAR MENSAGEM DE ERRO
      }
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>
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
          {errors.nome && <p style={{ color: 'red' }}>{errors.nome}</p>}
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
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
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
          {errors.senha && <p style={{ color: 'red' }}>{errors.senha}</p>}
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default RegisterPage;
