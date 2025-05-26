import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import './ProductPage.css';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <Header
        searchTerm=""
        onSearch={() => {}}
        onLogoClick={() => navigate('/', { replace: true })}
      />

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

      <Footer />
    </div>
  );
};

export default ProductPage;
