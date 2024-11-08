import React, { useState } from 'react';
import api from '../../api';

const produtos = [
  {
    nome: 'Cadeira GAMER Ergonomica',
    preco: 399.99,
    descricao: 'Cadeira ergonômica com apoio para lombar e ajuste de altura.',
    url_foto: 'http://localhost:3000/imagens/CADEIRA.png',
  },
  {
    nome: 'PC Gamer High-End',
    preco: 4999.99,
    descricao:
      'PC gamer com processador Intel i9, 32GB RAM, e placa gráfica RTX 3080.',
    url_foto: 'http://localhost:3000/imagens/PC-GAMER.png',
  },
  {
    nome: 'Teclado Mecânico RGB',
    preco: 156.79,
    descricao:
      'Teclado mecânico com switches azuis e iluminação RGB personalizável.',
    url_foto: 'http://localhost:3000/imagens/TECLADO.png',
  },
  {
    nome: 'Fone de Ouvido Gamer Bluetooth',
    preco: 151.29,
    descricao: 'Fone de ouvido Bluetooth com cancelamento de ruído.',
    url_foto: 'http://localhost:3000/imagens/FONE.png',
  },
  {
    nome: 'Mouse Gamer RGB',
    preco: 83.59,
    descricao: 'Mouse gamer com iluminação RGB e DPI ajustável.',
    url_foto: 'http://localhost:3000/imagens/MOUSE.png',
  },
];

const AdminPage = () => {
  const [product, setProduct] = useState({
    nome: '',
    preco: '',
    descricao: '',
    url_foto: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/produtos', {
        produto: product,
      });
      console.log(response.data);
      alert('Produto cadastrado com sucesso!');
      setProduct({ nome: '', preco: '', descricao: '', url_foto: '' });
    } catch (error) {
      console.error('Erro ao cadastrar o produto:', error);
      alert('Erro ao cadastrar o produto');
    }
  };

  const cadastrarProduto = async (produto) => {
    try {
      const response = await api.post('/produtos', {
        produto,
      });
      console.log(
        `Produto ${produto.nome} cadastrado com sucesso:`,
        response.data
      );
    } catch (error) {
      console.error(
        `Erro ao cadastrar o produto ${produto.nome}:`,
        error.message
      );
    }
  };

  const seedProdutos = async () => {
    for (const produto of produtos) {
      await cadastrarProduto(produto);
    }
    alert('Todos os produtos foram cadastrados com sucesso!');
  };

  return (
    <div>
      <h1>Administração de Produtos</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={product.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Preço:</label>
          <input
            type="number"
            step="0.01"
            name="preco"
            value={product.preco}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <input
            type="text"
            name="descricao"
            value={product.descricao}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>URL da Foto:</label>
          <input
            type="text"
            name="url_foto"
            value={product.url_foto}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Cadastrar Produto</button>
      </form>
      <button
        onClick={seedProdutos}
        style={{ marginTop: '20px', backgroundColor: 'red' }}
      >
        Cadastrar Produtos Padrão
      </button>
    </div>
  );
};

export default AdminPage;
