import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const styles = {
  productPage: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  price: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  image: {
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    fontSize: '18px',
    cursor: 'pointer',
  },
  header: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
  },
  categories: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  category: {
    margin: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
  },
  products: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  product: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
  },
};

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        console.log('ID do produto:', id);
        const response = await api.get(`https://api.mercadolibre.com/items/${id}`);
        console.log('Resposta da API:', response.data);
        setProduct(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!product) {
    return <div>Produto não encontrado.</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h1>InfoWorld</h1>
      </div>
      <div style={styles.productPage}>
        <h1 style={styles.title}>{product.title}</h1>
        <p style={styles.price}>{product.price}</p>
        <img style={styles.image} src={product.thumbnail} alt={product.title} />
        <p>{product.warranty}</p>
        <button style={styles.button}>Adicionar ao Carrinho</button>
      </div>
    </div>
  );
};

export default ProductPage;
