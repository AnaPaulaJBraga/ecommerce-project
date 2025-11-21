import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Product from './Product';

describe('Product component', () => {
  const mockItem = {
    id: 1,
    nome: 'Notebook Gamer',
    imagem: 'https://example.com/notebook.jpg',
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

    expect(screen.getByText('R$ 4500.00')).toBeInTheDocument();
    expect(screen.getByText('Notebook Gamer')).toBeInTheDocument();

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockItem.imagem);
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

    expect(true).toBe(true);
  });

  it('retorna null se item não existir', () => {
    const { container } = render(<Product item={null} addToCart={() => {}} />);

    expect(container.firstChild).toBeNull();
  });

  it('monta URL completa quando imagem não começa com http', () => {
    const item = {
      nome: 'Produto',
      imagem: '/media/produto.jpg',
      preco: 10,
    };

    render(<Product item={item} addToCart={() => {}} />);

    const img = screen.getByRole('img');

    expect(img).toHaveAttribute(
      'src',
      'http://127.0.0.1:8000/media/produto.jpg'
    );
  });

  it('usa placeholder quando não há imagem', () => {
    const item = {
      nome: 'Produto sem imagem',
      preco: 30,
    };

    render(<Product item={item} addToCart={() => {}} />);

    const img = screen.getByRole('img');

    expect(img.src).toContain('placeholder');
  });
});
