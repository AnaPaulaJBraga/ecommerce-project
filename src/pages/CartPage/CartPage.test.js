import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import CheckoutPage from './CartPage';
import { getFromStorage, saveToStorage } from '../../utils/storage';

jest.mock('../../utils/storage', () => ({
  getFromStorage: jest.fn(),
  saveToStorage: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

// mock PIX
jest.mock('../../components/PixQRCode', () => ({
  __esModule: true,
  default: () => <div data-testid="pix-qrcode">PIX</div>,
}));

describe('CheckoutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCart = [
    { id: 1, nome: 'Produto A', preco: 10, quantidade: 2 },
    { id: 2, nome: 'Produto B', preco: 5, quantidade: 1 },
  ];

  const renderComp = () =>
    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

  test('exibe carrinho vazio quando não há itens', () => {
    getFromStorage.mockReturnValueOnce(null);

    renderComp();

    expect(screen.getByText(/Seu carrinho está vazio/i)).toBeInTheDocument();
  });

  test('renderiza resumo do carrinho quando há itens', () => {
    getFromStorage.mockReturnValueOnce(mockCart);

    renderComp();

    expect(screen.getByText(/Resumo do Carrinho/i)).toBeInTheDocument();
    expect(screen.getByText(/Produto A/i)).toBeInTheDocument();
    expect(screen.getByText(/Produto B/i)).toBeInTheDocument();
  });

  test('permite preencher os campos de endereço', async () => {
    getFromStorage.mockReturnValueOnce(mockCart);
    renderComp();

    const nome = screen.getByPlaceholderText('Nome completo');

    await userEvent.type(nome, 'Ana Paula');
    expect(nome).toHaveValue('Ana Paula');
  });

  test('seleciona pagamento por cartão e renderiza inputs', async () => {
    getFromStorage.mockReturnValueOnce(mockCart);
    renderComp();

    fireEvent.click(screen.getByRole('radio', { name: /cartão/i }));

    expect(screen.getByPlaceholderText('Número do cartão')).toBeInTheDocument();
  });

  test('valida número do cartão inválido', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    getFromStorage.mockReturnValueOnce(mockCart);
    renderComp();

    fireEvent.click(screen.getByRole('radio', { name: /cartão/i }));

    // preencher endereço
    const addressInputs = [
      'Nome completo',
      'Rua',
      'Número',
      'Cidade',
      'Estado',
      'CEP',
    ];
    addressInputs.forEach((label, idx) => {
      fireEvent.change(screen.getByPlaceholderText(label), {
        target: { value: `v${idx}` },
      });
    });

    fireEvent.change(screen.getByPlaceholderText('Número do cartão'), {
      target: { value: '123' }, // inválido
    });

    fireEvent.change(screen.getByPlaceholderText('Validade (MM/AA)'), {
      target: { value: '12/30' },
    });

    fireEvent.change(screen.getByPlaceholderText('CVV'), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Finalizar Pedido/i }));

    expect(window.alert).toHaveBeenCalledWith(
      'Número do cartão inválido. Deve conter entre 13 e 16 dígitos.'
    );
  });

  test('valida formato da validade', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    getFromStorage.mockReturnValueOnce(mockCart);
    renderComp();

    fireEvent.click(screen.getByRole('radio', { name: /cartão/i }));

    const addressInputs = [
      'Nome completo',
      'Rua',
      'Número',
      'Cidade',
      'Estado',
      'CEP',
    ];
    addressInputs.forEach((label, idx) => {
      fireEvent.change(screen.getByPlaceholderText(label), {
        target: { value: `v${idx}` },
      });
    });

    fireEvent.change(screen.getByPlaceholderText('Número do cartão'), {
      target: { value: '1234123412341' },
    });

    fireEvent.change(screen.getByPlaceholderText('Validade (MM/AA)'), {
      target: { value: '1' }, // inválido → NÃO forma MM/AA
    });

    fireEvent.change(screen.getByPlaceholderText('CVV'), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Finalizar Pedido/i }));

    expect(window.alert).toHaveBeenCalledWith(
      'Validade inválida. Use o formato MM/AA.'
    );
  });

  test('valida CVV inválido', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    getFromStorage.mockReturnValueOnce(mockCart);
    renderComp();

    fireEvent.click(screen.getByRole('radio', { name: /cartão/i }));

    const addressInputs = [
      'Nome completo',
      'Rua',
      'Número',
      'Cidade',
      'Estado',
      'CEP',
    ];
    addressInputs.forEach((label, idx) => {
      fireEvent.change(screen.getByPlaceholderText(label), {
        target: { value: `v${idx}` },
      });
    });

    fireEvent.change(screen.getByPlaceholderText('Número do cartão'), {
      target: { value: '1234123412341' },
    });

    fireEvent.change(screen.getByPlaceholderText('Validade (MM/AA)'), {
      target: { value: '12/30' },
    });

    fireEvent.change(screen.getByPlaceholderText('CVV'), {
      target: { value: '12' }, // inválido
    });

    fireEvent.click(screen.getByRole('button', { name: /Finalizar Pedido/i }));

    expect(window.alert).toHaveBeenCalledWith(
      'CVV inválido. Deve conter 3 ou 4 dígitos.'
    );
  });

  test('renderiza QRCode quando PIX é selecionado', () => {
    getFromStorage.mockReturnValueOnce(mockCart);
    renderComp();

    fireEvent.click(screen.getByRole('radio', { name: /Pix/i }));

    expect(screen.getByTestId('pix-qrcode')).toBeInTheDocument();
  });

  test('finaliza pedido com cartão e limpa carrinho', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    getFromStorage.mockReturnValueOnce(mockCart);

    renderComp();

    fireEvent.click(screen.getByRole('radio', { name: /cartão/i }));

    const addressInputs = [
      'Nome completo',
      'Rua',
      'Número',
      'Cidade',
      'Estado',
      'CEP',
    ];
    addressInputs.forEach((label, idx) => {
      fireEvent.change(screen.getByPlaceholderText(label), {
        target: { value: `v${idx}` },
      });
    });

    fireEvent.change(screen.getByPlaceholderText('Número do cartão'), {
      target: { value: '1234123412341' },
    });

    fireEvent.change(screen.getByPlaceholderText('Validade (MM/AA)'), {
      target: { value: '12/30' },
    });

    fireEvent.change(screen.getByPlaceholderText('CVV'), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Finalizar Pedido/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
      expect(saveToStorage).toHaveBeenCalledWith('cart', []);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handlePaymentChange filtra caracteres não numéricos em numeroCartao', () => {
    getFromStorage.mockReturnValueOnce(mockCart);
    renderComp();

    fireEvent.click(screen.getByRole('radio', { name: /cartão/i }));

    const input = screen.getByPlaceholderText(/Número do cartão/i);
    fireEvent.change(input, {
      target: { name: 'numeroCartao', value: '1234abcd5678' },
    });

    expect(input).toHaveValue('12345678');
  });

  test('handlePaymentChange formata validade como MM/AA', () => {
    getFromStorage.mockReturnValueOnce(mockCart);
    renderComp();

    fireEvent.click(screen.getByRole('radio', { name: /cartão/i }));

    const input = screen.getByPlaceholderText(/Validade/i);
    fireEvent.change(input, { target: { name: 'validade', value: '1299' } });

    expect(input).toHaveValue('12/99');
  });

  test('removeFromCart remove 1 quantidade e remove item quando chega a 0', () => {
    getFromStorage.mockReturnValueOnce([
      { id: 1, nome: 'A', preco: 10, quantidade: 1 },
    ]);

    renderComp();

    const removeButton = screen.getByRole('button', { name: /remover/i });
    fireEvent.click(removeButton);

    expect(saveToStorage).toHaveBeenCalledWith('cart', []);
  });
  test('salva carrinho no storage quando ele muda', () => {
    getFromStorage.mockReturnValueOnce(mockCart);

    renderComp();

    const removeButton = screen.getAllByRole('button', { name: /remover/i })[0];
    fireEvent.click(removeButton);

    expect(saveToStorage).toHaveBeenCalled();
  });

  test('botão Finalizar Pedido fica desativado com endereço incompleto', () => {
    getFromStorage.mockReturnValueOnce(mockCart);
    renderComp();

    const button = screen.getByRole('button', { name: /Finalizar Pedido/i });

    expect(button).toBeDisabled();
  });

  test('finaliza pedido com Pix', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    getFromStorage.mockReturnValueOnce(mockCart);
    renderComp();

    fireEvent.click(screen.getByRole('radio', { name: /Pix/i }));

    ['Nome completo', 'Rua', 'Número', 'Cidade', 'Estado', 'CEP'].forEach(
      (label, idx) => {
        fireEvent.change(screen.getByPlaceholderText(label), {
          target: { value: `v${idx}` },
        });
      }
    );

    fireEvent.click(screen.getByRole('button', { name: /Finalizar Pedido/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
