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

    expect(
      screen.getByPlaceholderText(/Digite seu e-mail/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Digite sua senha/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByAltText(/Logo InfoWord/i)).toBeInTheDocument();
  });

  it('exibe erros quando campos estão vazios e o formulário é enviado', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Insira um email/i)).toBeInTheDocument();
      expect(screen.getByText(/Insira uma senha/i)).toBeInTheDocument();
    });
  });

  it('envia formulário com sucesso e navega', async () => {
    api.post.mockResolvedValueOnce({ data: { token: 'abc123' } });
    renderPage();

    await userEvent.type(
      screen.getByPlaceholderText(/Digite seu e-mail/i),
      'test@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Digite sua senha/i),
      '123456'
    );

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Login realizado com sucesso!/i)
      ).toBeInTheDocument();
    });

    // Espera o setTimeout antes da navegação
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'), {
      timeout: 2500,
    });
  });

  it('exibe mensagem de erro quando login falha', async () => {
    api.post.mockRejectedValueOnce(new Error('Erro no login'));
    renderPage();

    await userEvent.type(
      screen.getByPlaceholderText(/Digite seu e-mail/i),
      'test@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Digite sua senha/i),
      'senhaerrada'
    );

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao fazer login. Verifique suas credenciais./i)
      ).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('atualiza valores ao digitar nos inputs', async () => {
    renderPage();

    const emailInput = screen.getByPlaceholderText(/Digite seu e-mail/i);
    const senhaInput = screen.getByPlaceholderText(/Digite sua senha/i);

    await userEvent.type(emailInput, 'novo@email.com');
    await userEvent.type(senhaInput, '123456');

    expect(emailInput).toHaveValue('novo@email.com');
    expect(senhaInput).toHaveValue('123456');
  });
});
