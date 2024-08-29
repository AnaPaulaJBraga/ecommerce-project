import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link
import './styles.css';
import HomeProducts from '../HomeProducts/HomeProducts';
import { FaShoppingCart } from 'react-icons/fa';

const HomeContainer = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Bem-vindo a nossa loja</h1>
        <p>Encontre os melhores produtos de informática aqui!</p>
        <div className="auth-buttons">
          <Link to="/register" className="auth-button">
            Cadastro
          </Link>
          <Link to="/login" className="auth-button">
            Login
          </Link>
          <Link to="/cart" className="auth-button cart-button">
            Carrinho
            <FaShoppingCart />
          </Link>
        </div>
      </header>
      <section className="home-featured-products">
        <HomeProducts />
      </section>
    </div>
  );
};

export default HomeContainer;
