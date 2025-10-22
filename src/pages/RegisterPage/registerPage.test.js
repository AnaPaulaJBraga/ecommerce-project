import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import api from '../../api';

// Mocks dos componentes Header e Footer
jest.mock('../../components/Header/Header', () => () => <div>Header</div>);
jest.mock('../../components/Footer/Footer', () => () => <div>Footer</div>);

// Mock da API
jest.mock('../../api', () => ({
  post: jest.fn(),
}));

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza todos os elementos da página', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cadastre-se/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite seu nome/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Digite seu e-mail/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Digite sua senha/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Cadastrar/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Header/i)).toBeInTheDocument();
    expect(screen.getByText(/Footer/i)).toBeInTheDocument();
  });

  test('exibe mensagens de erro quando os campos estão vazios', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    expect(await screen.findByText(/Insira um nome/i)).toBeInTheDocument();
    expect(screen.getByText(/Insira um email/i)).toBeInTheDocument();
    expect(screen.getByText(/Insira uma senha/i)).toBeInTheDocument();
  });

  test('atualiza valores do formulário ao digitar', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    const nomeInput = screen.getByPlaceholderText(/Digite seu nome/i);
    const emailInput = screen.getByPlaceholderText(/Digite seu e-mail/i);
    const senhaInput = screen.getByPlaceholderText(/Digite sua senha/i);

    fireEvent.change(nomeInput, { target: { value: 'Ana Paula' } });
    fireEvent.change(emailInput, { target: { value: 'ana@email.com' } });
    fireEvent.change(senhaInput, { target: { value: '123456' } });

    expect(nomeInput.value).toBe('Ana Paula');
    expect(emailInput.value).toBe('ana@email.com');
    expect(senhaInput.value).toBe('123456');
  });

  test('submete o formulário com sucesso e navega', async () => {
    jest.useFakeTimers(); // ativa timers falsos

    api.post.mockResolvedValueOnce({}); // cadastro
    api.post.mockResolvedValueOnce({}); // login

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Digite seu nome/i), {
      target: { value: 'Ana Paula' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Digite seu e-mail/i), {
      target: { value: 'ana@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    // Espera até que a mensagem de sucesso apareça
    await waitFor(() => {
      expect(
        screen.getByText(/Cadastrado e logado com sucesso!/i)
      ).toBeInTheDocument();
    });

    // Avança todos os timers para disparar o setTimeout
    jest.runAllTimers();

    // Agora o navigate deve ter sido chamado
    expect(mockNavigate).toHaveBeenCalledWith('/');

    jest.useRealTimers(); // volta aos timers reais
  });

  test('exibe mensagem de erro quando o cadastro falha', async () => {
    api.post.mockRejectedValueOnce(new Error('Erro de API'));

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Digite seu nome/i), {
      target: { value: 'Ana' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Digite seu e-mail/i), {
      target: { value: 'ana@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao cadastrar. Tente novamente./i)
      ).toBeInTheDocument();
    });
  });
});
