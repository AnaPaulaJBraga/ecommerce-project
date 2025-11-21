import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
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

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

  it('renderiza o formulário corretamente', () => {
    renderPage();

    expect(screen.getByPlaceholderText(/Nome de usuário/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Digite sua senha/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByAltText(/Logo InfoWord/i)).toBeInTheDocument();
  });

  it('exibe erros quando campos estão vazios ao enviar', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Insira seu nome de usuário/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Insira sua senha/i)).toBeInTheDocument();
    });
  });

  it('envia formulário com sucesso e navega', async () => {
    api.post.mockResolvedValueOnce({
      data: { access: 'token123', refresh: 'refresh123' },
    });

    renderPage();

    await userEvent.type(
      screen.getByPlaceholderText(/Nome de usuário/i),
      'ana'
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Digite sua senha/i),
      '123456'
    );

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Login realizado com sucesso!/i)
      ).toBeInTheDocument()
    );

    // Espera o setTimeout de redirecionamento
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('exibe mensagem de erro quando login falha', async () => {
    api.post.mockRejectedValueOnce(new Error('login failed'));

    renderPage();

    await userEvent.type(
      screen.getByPlaceholderText(/Nome de usuário/i),
      'ana'
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Digite sua senha/i),
      'senhaerrada'
    );

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Credenciais inválidas. Verifique e tente novamente./i)
      ).toBeInTheDocument()
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('atualiza valores ao digitar nos inputs', async () => {
    renderPage();

    const userInput = screen.getByPlaceholderText(/Nome de usuário/i);
    const passInput = screen.getByPlaceholderText(/Digite sua senha/i);

    await userEvent.type(userInput, 'novoUser');
    await userEvent.type(passInput, '123456');

    expect(userInput).toHaveValue('novoUser');
    expect(passInput).toHaveValue('123456');
  });
});
