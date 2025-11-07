import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from './AdminPage';
import api from '../../api';

jest.mock('../../api');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

describe('AdminPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente o formulário', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preço/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/URL da Foto/i)).toBeInTheDocument();
  });

  it('permite preencher os inputs', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    const nome = screen.getByLabelText(/Nome/i);
    await userEvent.type(nome, 'Produto Teste');

    expect(nome).toHaveValue('Produto Teste');
  });

  it('envia o formulário e chama api.post com os dados corretos', async () => {
    api.post.mockResolvedValueOnce({ data: { sucesso: true } });

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/Nome/i), 'Cadeira Gamer');
    await userEvent.type(screen.getByLabelText(/Preço/i), '399.99');
    await userEvent.type(screen.getByLabelText(/Descrição/i), 'Teste desc');
    await userEvent.type(
      screen.getByLabelText(/URL da Foto/i),
      'http://x.com/img.png'
    );

    fireEvent.click(
      screen.getByRole('button', { name: /^Cadastrar Produto$/ })
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/produtos', {
        produto: {
          nome: 'Cadeira Gamer',
          preco: '399.99',
          descricao: 'Teste desc',
          url_foto: 'http://x.com/img.png',
        },
      });
    });
  });

  it('exibe erro caso o cadastro falhe', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    api.post.mockRejectedValueOnce(new Error('Erro API'));

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/Nome/i), 'X');
    await userEvent.type(screen.getByLabelText(/Preço/i), '10');
    await userEvent.type(screen.getByLabelText(/Descrição/i), 'Y');
    await userEvent.type(screen.getByLabelText(/URL da Foto/i), 'Z');

    fireEvent.click(
      screen.getByRole('button', { name: /^Cadastrar Produto$/ })
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Erro ao cadastrar o produto');
    });
  });

  it('seedProdutos: deve chamar cadastrarProduto para todos os produtos', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    api.post.mockResolvedValue({});

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    const btn = screen.getByRole('button', {
      name: /Cadastrar Produtos Padrão/i,
    });

    fireEvent.click(btn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(5);
    });
  });
});
