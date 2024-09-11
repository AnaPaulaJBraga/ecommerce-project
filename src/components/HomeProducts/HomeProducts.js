import React from 'react';
import './styles.css';
import prod1 from '../../assets/CADEIRA.png';
import prod2 from '../../assets/FONE.png';
import prod3 from '../../assets/MOUSE.png';
import prod4 from '../../assets/PC-GAMER.png';
import prod5 from '../../assets/TECLADO.png';
import { Link } from 'react-router-dom';

const HomeProducts = () => {
  return (
    <div className="home">
      <section className="home-featured-products">
        <div className="products-list">
          <Link to="/product/1" className="product-item">
            <img src={prod1} alt="Product 1" />
            <h3>Cadeira</h3>
            <p>Descrição do produto 1</p>
          </Link>
          <Link to="/product/2" className="product-item">
            <img src={prod2} alt="Product 2" />
            <h3>Fone</h3>
            <p>Descrição do produto 2</p>
          </Link>
          <Link to="/product/3" className="product-item">
            <img src={prod3} alt="Product 3" />
            <h3>Mouse</h3>
            <p>Descrição do produto 3</p>
          </Link>
          <Link to="/product/4" className="product-item">
            <img src={prod4} alt="Product 4" />
            <h3>PC Gamer</h3>
            <p>Descrição do produto 4</p>
          </Link>
          <Link to="/product/5" className="product-item">
            <img src={prod5} alt="Product 5" />
            <h3>Teclado</h3>
            <p>Descrição do produto 5</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomeProducts;
