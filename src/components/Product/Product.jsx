import React from 'react';
import './Product.css';
import { MdShoppingCartCheckout } from 'react-icons/md';
import PropTypes from 'prop-types';

const Product = ({ item, addToCart }) => {
  return (
    <li className="product-container">
      <img className="product-image" src={item.thumbnail} alt="" />
      <div className="product-info">
        <h2 className="product-price">R$ {item.price}</h2>
        <h2 className="product-title">{item.title}</h2>
      </div>

      <div className="product-button">
        <button onClick={() => addToCart(item)}>
          Adicionar ao Carrinho <MdShoppingCartCheckout />
        </button>
      </div>
    </li>
  );
};

export default Product;
Product.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};
