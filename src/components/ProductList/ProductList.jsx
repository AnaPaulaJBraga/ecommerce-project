import React from 'react';
import Product from '../Product/Product'; // ajuste o caminho se necessário
import PropTypes from 'prop-types';
import './ProductList.css';

const ProductList = ({ products, addToCart, seeDetails }) => {
  if (!products || products.length === 0) {
    return <p>Nenhum produto encontrado.</p>;
  }

  return (
    <ul className="product-list">
      {products.map((item, index) =>
        item ? (
          <Product
            key={item.id || index}
            item={item}
            addToCart={addToCart}
            seeDetails={seeDetails}
          />
        ) : null
      )}
    </ul>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      nome: PropTypes.string,
      preco: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      imagem: PropTypes.string,
    })
  ).isRequired,
  addToCart: PropTypes.func.isRequired,
  seeDetails: PropTypes.func,
};

export default ProductList;
