import React from 'react';
import './styles.css';
import prod1 from '../../assets/cadeira.jpg';
import prod2 from '../../assets/fone.jpg';
import prod3 from '../../assets/pc.jpeg';
import { Link } from 'react-router-dom';

const HomeProducts = () => {
  return (
    <div className="home">
      <section className="home-featured-products">
        <h2>Produtos em Destaque</h2>
        <div className="products-list">
          <Link to="/product/1" className="product-item">
            <img src={prod1} alt="Product 1" />
            <h3>Produto 1</h3>
            <p>Descrição do produto 1</p>
          </Link>
          <Link to="/product/2" className="product-item">
            <img src={prod2} alt="Product 2" />
            <h3>Produto 2</h3>
            <p>Descrição do produto 2</p>
          </Link>
          <Link to="/product/3" className="product-item">
            <img src={prod3} alt="Product 3" />
            <h3>Produto 3</h3>
            <p>Descrição do produto 3</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomeProducts;
