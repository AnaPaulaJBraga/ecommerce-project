import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductList from '../../components/ProductList/ProductList';
import Cart from '../../components/Cart/Cart';
import logo from '../../assets/LOGO_INFOWORD.png';
import './Home.css';
import api from '../../api';

const Home = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/produtos');
      setItems(response.data.dados);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const seeDetails = async (item) => {
    navigate(`/product/${item.id}`);
  };

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (itemToRemove) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== itemToRemove.id)
    );
  };
  const toggleCartVisibility = () => {
    setCartVisible((prevState) => !prevState);
  };

  return (
    <div className="home">
      <header className="home-header">
        <img src={logo} alt="logo" className="logo" />
        <div className="auth-buttons">
          <Link to="/register" className="auth-button">
            Cadastro
          </Link>
          <Link to="/login" className="auth-button">
            Login
          </Link>
          <Link to="/admin" className="auth-button">
            Admin
          </Link>
          <button onClick={toggleCartVisibility} className="cart-button">
            Carrinho ({cart.length})
          </button>
        </div>
      </header>
      <section className="home-featured-products">
        {loading && <p>Carregando...</p>}
        <div className="app">
          <ProductList
            items={items}
            addToCart={addToCart}
            seeDetails={seeDetails}
          />
        </div>
        {cartVisible && (
          <div className="cart-container">
            <Cart cart={cart} removeFromCart={removeFromCart} />
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
