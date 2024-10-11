import React from 'react';
import Product from '../Product/Product';
import './ProductList.css';
import PropTypes from 'prop-types';

const ProductList = ({ items, addToCart }) => {
  return (
    <ul className="product-list">
      {items.map((item) => (
        <Product key={item.id} item={item} addToCart={addToCart} />
      ))}
    </ul>
  );
};

export default ProductList;
ProductList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  addToCart: PropTypes.func.isRequired,
};
