import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Corrigido: um único import
import api from '../../api';
import logo from '../../assets/LOGO_INFOWORD.png';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Inicializar o hook navigate
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async (productId) => {
    setLoading(true);
    try {
      const response = await api.get(`/produtos/${productId}`);
      setProduct(response.data);
    } catch (err) {
      setError('Erro ao buscar produto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Produto não encontrado</p>;

  return (
    <div className="productPage">
      <header className="home-header">
        <img src={logo} alt="logo" className="logo" />
      </header>
      <div className="productContainer">
        <div className="image-container">
          <img className="image" src={product.url_foto} alt={product.nome} />
        </div>
        <div className="details">
          <h1 className="title">{product.nome}</h1>
          <p className="price">Preço: {product.preco}</p>
          <p className="description">Descrição: {product.descricao}</p>
          <button className="back-button" onClick={() => navigate('/')}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
