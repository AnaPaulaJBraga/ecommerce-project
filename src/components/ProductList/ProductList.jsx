import React from 'react';
import Product from '../Product/Product';
import './ProductList.css';
import PropTypes from 'prop-types';

const ProductList = ({ items, addToCart, seeDetails }) => {
  return (
    <ul className="product-list">
      {items.map((item) => (
        <Product
          key={item.id}
          item={item}
          addToCart={addToCart}
          seeDetails={seeDetails}
        />
      ))}
    </ul>
  );
};

export default ProductList;
ProductList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nome: PropTypes.string.isRequired,
    })
  ).isRequired,
  addToCart: PropTypes.func.isRequired,
  seeDetails: PropTypes.func,
};
