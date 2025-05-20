import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../../components/ProductList/ProductList';
import Cart from '../../components/Cart/Cart';
import Layout from '../../components/Layout/Layout';
import './Home.css';
import api from '../../api';
import logo from '../../assets/LOGO_INFOWORD.png';

const Home = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/produtos');
      setItems(response.data.dados);
      setFilteredItems(response.data.dados);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item =>
      item.nome.toLowerCase().includes(term.toLowerCase()) ||
      (item.descricao && item.descricao.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredItems(filtered);
  };

  const handleLogoClick = () => {
    navigate('/', { replace: true });
    fetchProducts();
    setSearchTerm('');
  };

  const seeDetails = (item) => {
    navigate(`/product/${item.id}`);
  };

  const addToCart = (item) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (itemToRemove) => {
    setCart(prev => prev.filter(item => item.id !== itemToRemove.id));
  };

  return (
    <Layout
      searchTerm={searchTerm}
      onSearch={handleSearch}
      onLogoClick={handleLogoClick}
    >
      <div className="home">
        <div className="home-banner">
          <div className="banner-content">
            <img src={logo} alt="Logo InfoWord" className="banner-logo" />
            <div className="banner-text">
              <h1>Bem-vindo à InfoWord</h1>
              <p>Tecnologia e qualidade para você</p>
            </div>
          </div>
        </div>

        <section className="home-featured-products">
          {loading && <p>Carregando...</p>}
          <div className="app">
            <ProductList
              items={filteredItems}
              addToCart={addToCart}
              seeDetails={seeDetails}
            />
          </div>
          <div className="cart">
            <Cart cart={cart} removeFromCart={removeFromCart} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
