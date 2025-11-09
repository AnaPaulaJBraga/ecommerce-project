import React from 'react';
import './Product.css';
import { MdShoppingCartCheckout, MdAddLink } from 'react-icons/md';
import PropTypes from 'prop-types';

const Product = ({ item, addToCart, seeDetails }) => {
  if (!item) return null; // Evita erros se item for undefined

  // Garante que o preço é um número antes de formatar
  const precoFormatado = item.preco
    ? `R$ ${parseFloat(item.preco).toFixed(2)}`
    : 'Preço indisponível';

  // Garante que o campo imagem é tratado corretamente
  let imagemSrc = '/placeholder.png';
  if (item.imagem) {
    if (item.imagem.startsWith('http')) {
      imagemSrc = item.imagem;
    } else {
      imagemSrc = `http://127.0.0.1:8000${item.imagem}`;
    }
  }

  return (
    <li className="product-container">
      <img className="product-image" src={imagemSrc} alt={item.nome || 'Produto'} />
      <div className="product-info">
        <h2 className="product-price">{precoFormatado}</h2>
        <h2 className="product-title">{item.nome || 'Produto sem nome'}</h2>
      </div>

      <div className="product-button">
        <button onClick={() => addToCart(item)}>
          Adicionar ao Carrinho <MdShoppingCartCheckout />
        </button>
        <button onClick={() => seeDetails && seeDetails(item)}>
          Ver detalhes <MdAddLink />
        </button>
      </div>
    </li>
  );
};

Product.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    nome: PropTypes.string,
    imagem: PropTypes.string,
    preco: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  addToCart: PropTypes.func.isRequired,
  seeDetails: PropTypes.func,
};

export default Product;
