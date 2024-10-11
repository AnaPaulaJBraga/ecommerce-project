import React from 'react';
import './Cart.css';
import { BsCartDash } from 'react-icons/bs';
import PropTypes from 'prop-types';

const Cart = ({ cart, removeFromCart }) => {
  return (
    <ul className="cart-container">
      {cart.length === 0 ? (
        <li>Seu carrinho esta sem items </li>
      ) : (
        cart.map((item) => (
          <li className="cart-item" key={item.id}>
            <img src={item.thumbnail} alt="" />
            <h2>{item.title}</h2>
            <button onClick={() => removeFromCart(item)}>
              <BsCartDash className="button-icon" />
            </button>
          </li>
        ))
      )}
    </ul>
  );
};

export default Cart;
Cart.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  removeFromCart: PropTypes.func.isRequired,
};
