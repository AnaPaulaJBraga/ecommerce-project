import React from 'react';
import './Cart.css';
import { BsCartDash } from 'react-icons/bs';
import PropTypes from 'prop-types';

const Cart = ({ cart, removeFromCart, addToCart }) => {
  const total = cart.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  return (
    <ul className="cart-container">
      {cart.length === 0 ? (
        <li>Seu carrinho está vazio</li>
      ) : (
        <>
          {cart.map((item) => (
            <li className="cart-item" key={item.id}>
              <img
                src={item.url_foto}
                alt={item.nome}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.nome}</h3>
                <p className="cart-text">Quantidade: {item.quantidade}</p>
                <p className="cart-text">
                  Valor total: R$ {(item.preco * item.quantidade).toFixed(2)}
                </p>
              </div>
              <div className="cart-item-buttons">
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item)}
                  aria-label={`Remover ${item.nome} do carrinho`}
                >
                  <BsCartDash className="button-icon" />
                </button>
                <button
                  className="add-button"
                  onClick={() => addToCart(item)}
                  aria-label={`Adicionar mais ${item.nome} no carrinho`}
                >
                  +
                </button>
              </div>
            </li>
          ))}
          <li className="cart-total">
            <strong>Total do carrinho: R$ {total.toFixed(2)}</strong>
          </li>
        </>
      )}
    </ul>
  );
};

export default Cart;

Cart.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nome: PropTypes.string.isRequired,
      url_foto: PropTypes.string.isRequired,
      preco: PropTypes.number.isRequired,
      quantidade: PropTypes.number.isRequired,
    })
  ).isRequired,
  removeFromCart: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
};
