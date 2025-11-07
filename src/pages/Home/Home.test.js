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
    ({ items, addToCart, seeDetails }) => (
      <div>
        {items.map((i) => (
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
      data: { dados: [{ id: 1, nome: 'Mouse' }] },
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Mouse')).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith('/produtos');
  });

  it('busca e filtra produtos', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        dados: [
          { id: 1, nome: 'Teclado Gamer' },
          { id: 2, nome: 'Mouse' },
        ],
      },
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getAllByTestId('product-item')).toHaveLength(2);
    });

    await userEvent.type(screen.getByPlaceholderText(/buscar/i), 'mouse');

    await waitFor(() => {
      const results = screen.getAllByTestId('product-item');
      expect(results).toHaveLength(1);
      expect(results[0]).toHaveTextContent('Mouse');
    });
  });

  it('retorna lista vazia ao buscar termo inexistente', async () => {
    api.get.mockResolvedValueOnce({
      data: { dados: [{ id: 1, nome: 'Monitor' }] },
    });

    renderHome();
    await waitFor(() => screen.getByText('Monitor'));

    await userEvent.type(screen.getByPlaceholderText(/buscar/i), 'abcxyz');

    await waitFor(() => {
      expect(screen.queryByTestId('product-item')).not.toBeInTheDocument();
    });
  });

  it('adiciona item ao carrinho', async () => {
    api.get.mockResolvedValueOnce({
      data: { dados: [{ id: 1, nome: 'Mouse' }] },
    });

    renderHome();
    await waitFor(() => screen.getByText('Mouse'));

    await userEvent.click(screen.getByText('add'));

    expect(saveToStorage).toHaveBeenCalled();
  });

  it('incrementa quantidade quando item já existe', async () => {
    getFromStorage.mockReturnValue([{ id: 1, nome: 'Mouse', quantidade: 1 }]);

    api.get.mockResolvedValueOnce({ data: { dados: [] } });

    renderHome();
    await userEvent.click(screen.getByText('add'));

    expect(saveToStorage).toHaveBeenCalled();
  });

  it('remove item do carrinho', async () => {
    getFromStorage.mockReturnValue([{ id: 1, nome: 'Mouse', quantidade: 2 }]);
    api.get.mockResolvedValueOnce({ data: { dados: [] } });

    renderHome();
    await userEvent.click(screen.getByText('remove'));

    expect(saveToStorage).toHaveBeenCalled();
  });

  it('exibe carrinho se houver itens', async () => {
    getFromStorage.mockReturnValue([{ id: 1, nome: 'Mouse', quantidade: 1 }]);
    api.get.mockResolvedValueOnce({ data: { dados: [] } });

    renderHome();

    expect(screen.getByTestId('cart-component')).toBeInTheDocument();
  });

  it('oculta carrinho se estiver vazio', async () => {
    getFromStorage.mockReturnValue([]);
    api.get.mockResolvedValueOnce({ data: { dados: [] } });

    renderHome();

    expect(screen.queryByTestId('cart-component')).not.toBeInTheDocument();
  });

  it('navega para detalhes ao clicar em details', async () => {
    api.get.mockResolvedValueOnce({
      data: { dados: [{ id: 10, nome: 'Notebook' }] },
    });

    renderHome();
    await waitFor(() => screen.getByText('Notebook'));

    await userEvent.click(screen.getByText('details'));

    expect(mockNavigate).toHaveBeenCalledWith('/product/10');
  });

  it('handleLogoClick recarrega produtos e navega', async () => {
    api.get.mockResolvedValue({ data: { dados: [] } });

    renderHome();

    const logo = screen.getByAltText('logo');
    await userEvent.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    expect(api.get).toHaveBeenCalledTimes(2);
  });
});
