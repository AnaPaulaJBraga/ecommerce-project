import React, { useEffect, useState } from 'react';
import Cart from '../../components/Cart/Cart';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';
import RigthHeader from '../../components/RigthHeader/RigthHeader';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => getFromStorage('cart') || []);
  const [address, setAddress] = useState({
    nome: '',
    rua: '',
    numero: '',
    cidade: '',
    estado: '',
    cep: '',
  });
  const [payment, setPayment] = useState({
    numeroCartao: '',
    nomeCartao: '',
    validade: '',
    cvv: '',
  });
  const [installments, setInstallments] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('');

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.preco * item.quantidade,
    0
  );

  useEffect(() => {
    saveToStorage('cart', cart);
  }, [cart]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;

    if (name === 'numeroCartao') {
      const numericValue = value.replace(/\D/g, '');
      setPayment((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === 'validade') {
      let numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 4) {
        numericValue = numericValue.slice(0, 4);
      }
      if (numericValue.length > 2) {
        numericValue = `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
      }
      setPayment((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === 'cvv') {
      const numericValue = value.replace(/\D/g, '');
      setPayment((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setPayment((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeFromCart = (itemToRemove) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === itemToRemove.id
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const isAddressComplete = Object.values(address).every(
    (value) => value.trim() !== ''
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === 'cartao') {
      if (!/^\d{13,16}$/.test(payment.numeroCartao)) {
        alert('Número do cartão inválido. Deve conter entre 13 e 16 dígitos.');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(payment.validade)) {
        alert('Validade inválida. Use o formato MM/AA.');
        return;
      }
      if (!/^\d{3,4}$/.test(payment.cvv)) {
        alert('CVV inválido. Deve conter 3 ou 4 dígitos.');
        return;
      }
    }

    alert(
      `Pedido finalizado com sucesso!\nForma de pagamento: ${paymentMethod}\nParcelamento: ${installments}x\nTotal: R$ ${totalAmount.toFixed(
        2
      )}`
    );

    setCart([]);
    saveToStorage('cart', []);
    navigate('/');
  };

  return (
    <RigthHeader onLogoClick={() => navigate('/')}>
      <div className="checkout-page-container">
        {cart.length >= 1 ? (
          <div className="checkout-page">
            <h2>Finalizar Pedido</h2>

            <section>
              <h3>Resumo do Carrinho</h3>
              <Cart cart={cart} removeFromCart={removeFromCart} />
            </section>
            <div>
              <button className="btn-go-to-cart" onClick={() => navigate('/')}>
                Adicionar mais produtos
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <h3>Endereço de Entrega</h3>
              <input
                name="nome"
                placeholder="Nome completo"
                value={address.nome}
                onChange={handleAddressChange}
                required
              />
              <input
                name="rua"
                placeholder="Rua"
                value={address.rua}
                onChange={handleAddressChange}
                required
              />
              <input
                name="numero"
                placeholder="Número"
                value={address.numero}
                onChange={handleAddressChange}
                required
              />
              <input
                name="cidade"
                placeholder="Cidade"
                value={address.cidade}
                onChange={handleAddressChange}
                required
              />
              <input
                name="estado"
                placeholder="Estado"
                value={address.estado}
                onChange={handleAddressChange}
                required
              />
              <input
                name="cep"
                placeholder="CEP"
                value={address.cep}
                onChange={handleAddressChange}
                required
              />

              <div className="payment-method">
                <h3>Forma de pagamento:</h3>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cartao"
                    checked={paymentMethod === 'cartao'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cartão
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="pix"
                    checked={paymentMethod === 'pix'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Pix
                </label>
              </div>

              {paymentMethod === 'cartao' && (
                <>
                  <label>
                    Parcelamento:
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                    >
                      {[...Array(6)].map((_, index) => {
                        const num = index + 1;
                        const parcela = totalAmount / num;
                        const text = `${num}x de R$ ${parcela.toFixed(
                          2
                        )} sem juros`;
                        return (
                          <option key={num} value={num}>
                            {text}
                          </option>
                        );
                      })}
                    </select>
                  </label>
                  <h3>Pagamento com Cartão</h3>
                  <input
                    name="numeroCartao"
                    placeholder="Número do cartão"
                    value={payment.numeroCartao}
                    onChange={handlePaymentChange}
                    required
                  />
                  <input
                    name="nomeCartao"
                    placeholder="Nome no cartão"
                    value={payment.nomeCartao}
                    onChange={handlePaymentChange}
                    required
                  />
                  <input
                    name="validade"
                    placeholder="Validade (MM/AA)"
                    value={payment.validade}
                    onChange={handlePaymentChange}
                    required
                  />
                  <input
                    name="cvv"
                    placeholder="CVV"
                    value={payment.cvv}
                    onChange={handlePaymentChange}
                    required
                  />
                </>
              )}

              {paymentMethod === 'pix' && (
                <p>
                  O QR Code para pagamento via Pix será gerado após finalizar o
                  pedido.
                </p>
              )}

              <button type="submit" disabled={!isAddressComplete} color="">
                Finalizar Pedido
              </button>
            </form>
          </div>
        ) : (
          <div className="empty-cart">
            <h2>Seu carrinho está vazio</h2>
            <button onClick={() => navigate('/')}>Voltar</button>
          </div>
        )}
      </div>
    </RigthHeader>
  );
};

export default CheckoutPage;
