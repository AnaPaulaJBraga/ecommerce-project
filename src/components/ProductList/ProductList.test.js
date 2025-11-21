import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductList from './ProductList';

jest.mock('../Product/Product', () => ({ item, addToCart, seeDetails }) => (
  <div>
    <p>{item.nome}</p>
    <button onClick={() => addToCart(item)}>Adicionar ao Carrinho</button>
    {seeDetails && (
      <button onClick={() => seeDetails(item)}>Ver detalhes</button>
    )}
  </div>
));

describe('ProductList component', () => {
  const mockProducts = [
    { id: 1, nome: 'Notebook Gamer', imagem: 'foto1.jpg', preco: 4500 },
    { id: 2, nome: 'Mouse Logitech', imagem: 'foto2.jpg', preco: 250 },
  ];

  const mockAddToCart = jest.fn();
  const mockSeeDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza todos os produtos da lista', () => {
    render(
      <ProductList
        products={mockProducts}
        addToCart={mockAddToCart}
        seeDetails={mockSeeDetails}
      />
    );

    expect(screen.getByText('Notebook Gamer')).toBeInTheDocument();
    expect(screen.getByText('Mouse Logitech')).toBeInTheDocument();
  });

  it('chama addToCart ao clicar no botão do produto', () => {
    render(
      <ProductList
        products={mockProducts}
        addToCart={mockAddToCart}
        seeDetails={mockSeeDetails}
      />
    );

    const buttons = screen.getAllByText(/Adicionar ao Carrinho/i);
    fireEvent.click(buttons[0]);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('chama seeDetails ao clicar no botão correspondente', () => {
    render(
      <ProductList
        products={mockProducts}
        addToCart={mockAddToCart}
        seeDetails={mockSeeDetails}
      />
    );

    const buttons = screen.getAllByText(/Ver detalhes/i);
    fireEvent.click(buttons[1]);

    expect(mockSeeDetails).toHaveBeenCalledTimes(1);
    expect(mockSeeDetails).toHaveBeenCalledWith(mockProducts[1]);
  });

  it('não quebra caso seeDetails não seja fornecido', () => {
    render(
      <ProductList
        products={mockProducts}
        addToCart={mockAddToCart}
        seeDetails={undefined}
      />
    );

    const cartButtons = screen.getAllByText(/Adicionar ao Carrinho/i);
    fireEvent.click(cartButtons[0]);
    fireEvent.click(cartButtons[1]);

    expect(mockAddToCart).toHaveBeenCalledTimes(2);

    // nenhum botão "Ver detalhes" deve aparecer
    expect(screen.queryByText(/Ver detalhes/i)).toBeNull();
  });
});
