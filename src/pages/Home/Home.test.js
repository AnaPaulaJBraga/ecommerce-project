import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import api from '../../api';
import { saveToStorage, getFromStorage } from '../../utils/storage';

jest.mock('../../api');

jest.mock('../../utils/storage', () => ({
  saveToStorage: jest.fn(),
  getFromStorage: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

jest.mock(
  '../../components/ProductList/ProductList',
  () =>
    ({ products, addToCart, seeDetails }) => (
      <div>
        {products.map((i) => (
          <div key={i.id} data-testid="product-item">
            {i.nome}
            <button onClick={() => addToCart(i)}>add</button>
            <button onClick={() => seeDetails(i)}>details</button>
          </div>
        ))}
      </div>
    )
);

jest.mock(
  '../../components/Cart/Cart',
  () =>
    ({ cart, removeFromCart, addToCart }) => (
      <div data-testid="cart-component">
        {cart.map((i) => (
          <div key={i.id} data-testid="cart-item">
            {i.nome}
            <button onClick={() => removeFromCart(i)}>remove</button>
            <button onClick={() => addToCart(i)}>add</button>
          </div>
        ))}
      </div>
    )
);

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getFromStorage.mockReturnValue([]);
  });

  const renderHome = () =>
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

  it('carrega produtos ao montar', async () => {
    api.get.mockResolvedValueOnce({
      data: [{ id: 1, nome: 'Mouse' }],
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Mouse')).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith('/produtos/');
  });

  it('busca e filtra produtos', async () => {
    api.get.mockResolvedValueOnce({
      data: [
        { id: 1, nome: 'Teclado Gamer' },
        { id: 2, nome: 'Mouse' },
      ],
    });

    renderHome();

    await waitFor(() =>
      expect(screen.getAllByTestId('product-item')).toHaveLength(2)
    );

    // Mock do campo de busca vindo do Layout
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'mouse');

    await waitFor(() => {
      const results = screen.getAllByTestId('product-item');
      expect(results).toHaveLength(1);
      expect(results[0]).toHaveTextContent('Mouse');
    });
  });

  it('retorna lista vazia ao buscar termo inexistente', async () => {
    api.get.mockResolvedValueOnce({
      data: [{ id: 1, nome: 'Monitor' }],
    });

    renderHome();
    await waitFor(() => screen.getByText('Monitor'));

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'abcxyz');

    await waitFor(() => {
      expect(screen.queryByTestId('product-item')).not.toBeInTheDocument();
    });
  });

  it('adiciona item ao carrinho', async () => {
    api.get.mockResolvedValueOnce({
      data: [{ id: 1, nome: 'Mouse' }],
    });

    renderHome();

    await waitFor(() => screen.getByText('Mouse'));

    await userEvent.click(screen.getByText('add'));

    expect(saveToStorage).toHaveBeenCalled();
  });

  it('incrementa quantidade quando item já existe', async () => {
    getFromStorage.mockReturnValue([{ id: 1, nome: 'Mouse', quantidade: 1 }]);

    api.get.mockResolvedValueOnce({ data: [] });

    renderHome();
    await waitFor(() => {});

    await userEvent.click(screen.getByText('add'));

    expect(saveToStorage).toHaveBeenCalled();
  });

  it('remove item do carrinho', async () => {
    getFromStorage.mockReturnValue([{ id: 1, nome: 'Mouse', quantidade: 2 }]);
    api.get.mockResolvedValueOnce({ data: [] });

    renderHome();
    await waitFor(() => {});

    await userEvent.click(screen.getByText('remove'));

    expect(saveToStorage).toHaveBeenCalled();
  });

  it('exibe carrinho se houver itens', async () => {
    getFromStorage.mockReturnValue([{ id: 1, nome: 'Mouse', quantidade: 1 }]);
    api.get.mockResolvedValueOnce({ data: [] });

    renderHome();

    expect(screen.getByTestId('cart-component')).toBeInTheDocument();
  });

  it('oculta carrinho se estiver vazio', async () => {
    getFromStorage.mockReturnValue([]);
    api.get.mockResolvedValueOnce({ data: [] });

    renderHome();

    expect(screen.queryByTestId('cart-component')).not.toBeInTheDocument();
  });

  it('navega para detalhes ao clicar em details', async () => {
    api.get.mockResolvedValueOnce({
      data: [{ id: 10, nome: 'Notebook' }],
    });

    renderHome();
    await waitFor(() => screen.getByText('Notebook'));

    await userEvent.click(screen.getByText('details'));

    expect(mockNavigate).toHaveBeenCalledWith('/product/10');
  });

  it('restaura lista original quando o campo de busca é limpo', async () => {
    api.get.mockResolvedValueOnce({
      data: [
        { id: 1, nome: 'Mouse' },
        { id: 2, nome: 'Teclado' },
      ],
    });

    renderHome();
    await waitFor(() =>
      expect(screen.getAllByTestId('product-item')).toHaveLength(2)
    );

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'mouse');

    await waitFor(() =>
      expect(screen.getAllByTestId('product-item')).toHaveLength(1)
    );

    await userEvent.clear(input);

    await waitFor(() =>
      expect(screen.getAllByTestId('product-item')).toHaveLength(2)
    );
  });

  it('exibe nenhum produto quando API falha', async () => {
    api.get.mockRejectedValueOnce(new Error('API error'));

    renderHome();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByTestId('product-item')).not.toBeInTheDocument();
  });
});
