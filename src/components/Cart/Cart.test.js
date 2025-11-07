import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from './Cart';

describe('Cart component', () => {
  const mockRemoveFromCart = jest.fn();
  const mockAddToCart = jest.fn();

  const mockCart = [
    {
      id: 1,
      nome: 'Produto A',
      url_foto: 'https://exemplo.com/a.jpg',
      preco: 10,
      quantidade: 2,
    },
    {
      id: 2,
      nome: 'Produto B',
      url_foto: 'https://exemplo.com/b.jpg',
      preco: 20,
      quantidade: 1,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir mensagem quando o carrinho estiver vazio', () => {
    render(
      <Cart
        cart={[]}
        removeFromCart={mockRemoveFromCart}
        addToCart={mockAddToCart}
      />
    );

    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();
  });

  it('deve renderizar os itens do carrinho corretamente', () => {
    render(
      <Cart
        cart={mockCart}
        removeFromCart={mockRemoveFromCart}
        addToCart={mockAddToCart}
      />
    );

    expect(screen.getByText('Produto A')).toBeInTheDocument();
    expect(screen.getByText('Produto B')).toBeInTheDocument();

    expect(screen.getByText('Quantidade: 2')).toBeInTheDocument();

    const valores = screen.getAllByText('Valor total: R$ 20.00');
    expect(valores.length).toBeGreaterThan(0);
  });

  it('deve calcular e exibir o total do carrinho corretamente', () => {
    render(
      <Cart
        cart={mockCart}
        removeFromCart={mockRemoveFromCart}
        addToCart={mockAddToCart}
      />
    );

    const total = screen.getByText('Total do carrinho: R$ 40.00');
    expect(total).toBeInTheDocument();
  });

  it('deve chamar removeFromCart ao clicar no botão de remover', () => {
    render(
      <Cart
        cart={mockCart}
        removeFromCart={mockRemoveFromCart}
        addToCart={mockAddToCart}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /remover/i });
    fireEvent.click(removeButtons[0]);

    expect(mockRemoveFromCart).toHaveBeenCalledTimes(1);
    expect(mockRemoveFromCart).toHaveBeenCalledWith(mockCart[0]);
  });

  it('deve chamar addToCart ao clicar no botão de adicionar', () => {
    render(
      <Cart
        cart={mockCart}
        removeFromCart={mockRemoveFromCart}
        addToCart={mockAddToCart}
      />
    );

    const addButtons = screen.getAllByRole('button', {
      name: /adicionar mais/i,
    });
    fireEvent.click(addButtons[1]);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockCart[1]);
  });
});
