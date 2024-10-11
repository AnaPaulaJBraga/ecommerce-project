import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList/ProductList';
import Cart from '../components/Cart/Cart';

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
    <div className="app">
      <ProductList items={items} addToCart={addToCart} />
      <Cart cart={cart} removeFromCart={removeFromCart} />
    </div>
  );
};

export default Home;
