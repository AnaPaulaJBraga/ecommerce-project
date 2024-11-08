import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const ProductPage = () => {
  const { id } = useParams();
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
    <div>
      <h1>{product.nome}</h1>
      <img height={300} src={product.url_foto} />
      <p>Preço: {product.preco}</p>
      <p>Descrição: {product.descricao}</p>
    </div>
  );
};

export default ProductPage;
