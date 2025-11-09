import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './RigthHeader.css';
import logo from '../../assets/LOGO_INFOWORD.png';

const RigthHeader = ({ onLogoClick, onSearch, children }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogoClick = () => {
    if (onLogoClick) onLogoClick();
    navigate('/', { replace: true });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  return (
    <>
      <header className="home-header">
        {/* Logo à esquerda */}
        <div className="header-left" onClick={handleLogoClick}>
          <img src={logo} alt="logo" className="logo" />
        </div>

        {/* Barra de pesquisa no centro */}
        <div className="header-center">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Botões à direita */}
        <div className="header-right">
          <Link to="/register" className="auth-button">Cadastro</Link>
          <Link to="/login" className="auth-button">Login</Link>
          <Link to="/cart" className="auth-button">Carrinho</Link>
          <Link to="/admin" className="auth-button">Admin</Link>
        </div>
      </header>

      <main>{children}</main>
    </>
  );
};

RigthHeader.propTypes = {
  onLogoClick: PropTypes.func,
  onSearch: PropTypes.func,
  children: PropTypes.node,
};

export default RigthHeader;
