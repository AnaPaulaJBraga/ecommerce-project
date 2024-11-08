import React from 'react';
import './Product.css';
import { MdShoppingCartCheckout, MdAddLink } from 'react-icons/md';
import PropTypes from 'prop-types';

const Product = ({ item, addToCart, seeDetails }) => {
  return (
    <li className="product-container">
      <img className="product-image" src={item.url_foto} alt="" />
      <div className="product-info">
        <h2 className="product-price">R$ {item.preco}</h2>
        <h2 className="product-title">{item.nome}</h2>
      </div>

      <div className="product-button">
        <button onClick={() => addToCart(item)}>
          Adicionar ao Carrinho <MdShoppingCartCheckout />
        </button>
        <button onClick={() => seeDetails(item)}>
          Ver detalhes <MdAddLink />
        </button>
      </div>
    </li>
  );
};

export default Product;
Product.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nome: PropTypes.string.isRequired,
    url_foto: PropTypes.string.isRequired,
    preco: PropTypes.number.isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
  seeDetails: PropTypes.func,
};
