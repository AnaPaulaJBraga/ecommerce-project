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

  // Busca o produto pelo ID
  const fetchProduct = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/produtos/${productId}`);
      setProduct(response.data);
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      setError('Não foi possível carregar o produto.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  if (loading) return <p className="loading">Carregando produto...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p className="not-found">Produto não encontrado.</p>;

  // Garante que o preço seja exibido corretamente
  const precoFormatado =
    product.preco !== undefined && product.preco !== null
      ? `R$ ${parseFloat(product.preco).toFixed(2)}`
      : 'Preço indisponível';

  // Garante que a imagem carregue corretamente
  const imagemSrc =
    product.imagem || product.url_foto || '/placeholder.png';

  return (
    <div className="productPage">
      <Header onLogoClick={() => navigate('/', { replace: true })} />

      <main className="productContainer">
        <div className="image-container">
          <img
            className="image"
            src={imagemSrc}
            alt={product.nome || 'Produto sem nome'}
            onError={(e) => {
              e.target.src = '/placeholder.png';
            }}
          />
        </div>

        <section className="details">
          <h1 className="title">{product.nome || 'Produto sem nome'}</h1>
          <p className="price">Preço: {precoFormatado}</p>
          <p className="description">
            Descrição: {product.descricao || 'Nenhuma descrição disponível.'}
          </p>

          <button
            className="back-button"
            onClick={() => navigate(-1)} // volta para a página anterior
          >
            Voltar
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
