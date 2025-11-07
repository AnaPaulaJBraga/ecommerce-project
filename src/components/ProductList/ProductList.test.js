import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductList from './ProductList';

describe('ProductList component', () => {
  const mockItems = [
    { id: 1, nome: 'Notebook Gamer', url_foto: 'foto1.jpg', preco: 4500 },
    { id: 2, nome: 'Mouse Logitech', url_foto: 'foto2.jpg', preco: 250 },
  ];

  const mockAddToCart = jest.fn();
  const mockSeeDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza todos os produtos da lista', () => {
    render(
      <ProductList
        items={mockItems}
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
        items={mockItems}
        addToCart={mockAddToCart}
        seeDetails={mockSeeDetails}
      />
    );

    const buttons = screen.getAllByText(/Adicionar ao Carrinho/i);
    fireEvent.click(buttons[0]);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockItems[0]);
  });

  it('chama seeDetails ao clicar no botão correspondente', () => {
    render(
      <ProductList
        items={mockItems}
        addToCart={mockAddToCart}
        seeDetails={mockSeeDetails}
      />
    );

    const buttons = screen.getAllByText(/Ver detalhes/i);
    fireEvent.click(buttons[1]);

    expect(mockSeeDetails).toHaveBeenCalledTimes(1);
    expect(mockSeeDetails).toHaveBeenCalledWith(mockItems[1]);
  });

  it('não quebra caso seeDetails não seja fornecido', () => {
    render(
      <ProductList
        items={mockItems}
        addToCart={mockAddToCart}
        seeDetails={undefined}
      />
    );

    const detailButtons = screen.getAllByText(/Ver detalhes/i);

    fireEvent.click(detailButtons[0]);
    fireEvent.click(detailButtons[1]);

    // nada deve quebrar
    expect(true).toBe(true);
  });
});
