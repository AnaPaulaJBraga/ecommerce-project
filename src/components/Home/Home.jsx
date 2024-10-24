import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductList from '../ProductList/ProductList';
import Cart from '../Cart/Cart';
import logo from '../../assets/LOGO_INFOWORD.png';
import './Home.css';

const Home = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `https://api.mercadolibre.com/sites/MLB/search?q=iphone`
      );
      setItems(response.data.results);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (itemToRemove) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== itemToRemove.id)
    );
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
        </div>
      </header>
      <section className="home-featured-products">
        <div className="app">
          <ProductList items={items} addToCart={addToCart} />
        </div>
        <div>
          <Cart cart={cart} removeFromCart={removeFromCart} />
        </div>
      </section>
    </div>
  );
};

export default Home;
