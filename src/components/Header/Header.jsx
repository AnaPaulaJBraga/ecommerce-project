import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/LOGO_INFOWORD.png';

const Header = ({
  searchTerm,
  onSearch,
  onLogoClick,
  items = [],
  onSelectSuggestion,
}) => {
  const navigate = useNavigate();
  const searchRef = useRef();

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
    navigate('/', { replace: true });
  };

  useEffect(() => {
    if (typeof onSearch !== 'function') return;

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onSearch]);

  return (
    <header className="home-header">
      <div className="header-left" onClick={handleLogoClick}>
        <img src={logo} alt="logo" className="logo" />
      </div>

      {onSearch && (
        <div className="header-center" ref={searchRef}>
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="search-bar"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
            />

            {searchTerm && items.length > 0 && (
              <ul className="suggestions-dropdown">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="suggestion-item"
                    onClick={() => onSelectSuggestion(item)}
                  >
                    <img
                      src={item.imagem || 'https://via.placeholder.com/40'}
                      alt={item.nome}
                      className="suggestion-img"
                    />
                    <span className="suggestion-name">{item.nome}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

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
  );
};

export default Header;
