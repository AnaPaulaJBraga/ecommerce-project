import React, { useState } from 'react';
import api from '../../api';
import './AdminPage.css';

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
    <div className="admin-container">
      <h1 className="admin-title">Administração de Produtos</h1>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="nome" className="form-label">
            Nome:
          </label>
          <input
            type="text"
            name="nome"
            id="nome"
            className="form-input"
            value={product.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="preco" className="form-label">
            Preço:
          </label>
          <input
            type="number"
            step="0.01"
            name="preco"
            id="preco"
            className="form-input"
            value={product.preco}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descricao" className="form-label">
            Descrição:
          </label>
          <input
            type="text"
            name="descricao"
            id="descricao"
            className="form-input"
            value={product.descricao}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="url_foto" className="form-label">
            URL da Foto:
          </label>
          <input
            type="text"
            name="url_foto"
            id="url_foto"
            className="form-input"
            value={product.url_foto}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Cadastrar Produto
        </button>
      </form>
      <button onClick={seedProdutos} className="default-product-button">
        Cadastrar Produtos Padrão
      </button>
    </div>
  );
};

export default AdminPage;
