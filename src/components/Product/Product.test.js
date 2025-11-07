import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Product from './Product';

describe('Product component', () => {
  const mockItem = {
    id: 1,
    nome: 'Notebook Gamer',
    url_foto: 'https://example.com/notebook.jpg',
    preco: 4500,
  };

  const mockAddToCart = jest.fn();
  const mockSeeDetails = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('renderiza corretamente as informações do produto', () => {
    render(
      <Product
        item={mockItem}
        addToCart={mockAddToCart}
        seeDetails={mockSeeDetails}
      />
    );

    expect(screen.getByText('R$ 4500')).toBeInTheDocument();
    expect(screen.getByText('Notebook Gamer')).toBeInTheDocument();

    const img = screen.getByRole('presentation');
    expect(img).toHaveAttribute('src', mockItem.url_foto);
  });

  it('chama addToCart ao clicar no botão correspondente', () => {
    render(
      <Product
        item={mockItem}
        addToCart={mockAddToCart}
        seeDetails={mockSeeDetails}
      />
    );

    fireEvent.click(screen.getByText(/Adicionar ao Carrinho/i));

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockItem);
  });

  it('chama seeDetails ao clicar no botão correspondente', () => {
    render(
      <Product
        item={mockItem}
        addToCart={mockAddToCart}
        seeDetails={mockSeeDetails}
      />
    );

    fireEvent.click(screen.getByText(/Ver detalhes/i));

    expect(mockSeeDetails).toHaveBeenCalledTimes(1);
    expect(mockSeeDetails).toHaveBeenCalledWith(mockItem);
  });

  it('não quebra caso seeDetails não seja fornecido', () => {
    render(
      <Product
        item={mockItem}
        addToCart={mockAddToCart}
        seeDetails={undefined}
      />
    );

    fireEvent.click(screen.getByText(/Ver detalhes/i));

    expect(mockSeeDetails).not.toHaveBeenCalled();
  });
});
