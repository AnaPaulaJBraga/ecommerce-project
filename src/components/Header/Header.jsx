import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './Header.css';
import logo from '../../assets/LOGO_INFOWORD.png';

const Header = ({ searchTerm, onSearch, onLogoClick }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    onLogoClick();
    navigate('/', { replace: true });
  };

  return (
    <header className="home-header">
      <div className="header-left" onClick={handleLogoClick}>
        <img src={logo} alt="logo" className="logo" />
      </div>

      <div className="header-center">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <div className="header-right">
        <Link to="/register" className="auth-button">Cadastro</Link>
        <Link to="/login" className="auth-button">Login</Link>
        <Link to="/admin" className="auth-button">Admin</Link>
      </div>
    </header>
  );
};

export default Header;