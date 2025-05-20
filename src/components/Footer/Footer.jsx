import React from 'react';
import './Footer.css';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* ... outras seções permanecem iguais ... */}
        
        <div className="footer-section">
          <h4>Redes Sociais</h4>
          <div className="social-icons">
            <span className="social-icon" aria-hidden="true">
              <FaFacebook />
            </span>
            <span className="social-icon" aria-hidden="true">
              <FaInstagram />
            </span>
            <span className="social-icon" aria-hidden="true">
              <FaLinkedin />
            </span>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} InfoWord. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;