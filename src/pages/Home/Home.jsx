import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../../components/ProductList/ProductList';
import Cart from '../../components/Cart/Cart';
import Layout from '../../components/Layout/Layout';
import './Home.css';
import api from '../../api';
import logo from '../../assets/LOGO_INFOWORD.png';
import { saveToStorage, getFromStorage } from '../../utils/storage';

const Home = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [cart, setCart] = useState(() => getFromStorage('cart') || []);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    saveToStorage('cart', cart);
  }, [cart]);

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

    const filtered = items.filter(
      (item) =>
        item.nome.toLowerCase().includes(term.toLowerCase()) ||
        (item.descricao &&
          item.descricao.toLowerCase().includes(term.toLowerCase()))
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

  const addToCartHome = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantidade: (p.quantidade || 1) + 1 } : p
        );
      }
      return [...prev, { ...item, quantidade: 1 }];
    });
  };

  const removeFromCart = (itemToRemove) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === itemToRemove.id
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const addToCart = (itemToAdd) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemToAdd.id);
      if (existing) {
        return prev.map((i) =>
          i.id === itemToAdd.id ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      } else {
        return [...prev, { ...itemToAdd, quantidade: 1 }];
      }
    });
  };

  return (
    <Layout
      searchTerm={searchTerm}
      onSearch={handleSearch}
      onLogoClick={handleLogoClick}
      items={filteredItems}
      onSelectSuggestion={seeDetails}
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
              addToCart={addToCartHome}
              seeDetails={seeDetails}
            />
          </div>
          {cart.length >= 1 && (
            <div className="cart">
              <Cart
                cart={cart}
                removeFromCart={removeFromCart}
                addToCart={addToCart}
              />
              <button
                className="btn-go-to-cart"
                onClick={() => navigate('/cart')}
              >
                Ver Carrinho
              </button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Home;
