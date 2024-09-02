import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link
import './styles.css';
import HomeProducts from '../HomeProducts/HomeProducts';
import { FaShoppingCart } from 'react-icons/fa';
import logo from '../../assets/LOGO_INFOWORD.png';

const HomeContainer = () => {
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
