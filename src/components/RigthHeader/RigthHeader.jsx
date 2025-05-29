import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './RigthHeader.css';
import logo from '../../assets/LOGO_INFOWORD.png';

const RigthHeader = ({ onLogoClick, children }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    onLogoClick();
    navigate('/', { replace: true });
  };

  return (
    <>
      <header className="home-header">
        <div className="header-left" onClick={handleLogoClick}>
          <img src={logo} alt="logo" className="logo" />
        </div>

        <div className="header-right">
          <Link to="/register" className="auth-button">
            Cadastro
          </Link>
          <Link to="/login" className="auth-button">
            Login
          </Link>
          <Link to="/cart" className="auth-button">
            Carrinho
          </Link>
          <Link to="/admin" className="auth-button">
            Admin
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
};

export default RigthHeader;
