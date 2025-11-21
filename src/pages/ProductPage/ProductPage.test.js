import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductPage from './ProductPage';
import api from './../../api';
import { MemoryRouter } from 'react-router-dom';

jest.mock('./../../api');

// Mock do navigate e params
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '101' }),
}));

// Mock do Header para permitir clique no logo
jest.mock('../../components/Header/Header', () => {
  return function MockHeader({ onLogoClick }) {
    return (
      <header data-testid="header">
        <img src="logo.png" alt="logo" onClick={onLogoClick} />
      </header>
    );
  };
});

describe('ProductPage - Info World', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it('renderiza as informações do produto corretamente', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        nome: 'Notebook Gamer ASUS TUF',
        descricao: 'Alto desempenho para jogos e trabalho.',
        preco: '6500.00',
        url_foto: '/notebook-asus.jpg',
      },
    });

    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );

    // Loading aparece
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    // Produto carregou
    await waitFor(() =>
      expect(screen.getByText(/Notebook Gamer ASUS TUF/i)).toBeInTheDocument()
    );

    expect(screen.getByText(/Alto desempenho/i)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 6500\.00/i)).toBeInTheDocument();

    // Verifica imagem do produto
    const img = screen.getByAltText('Notebook Gamer ASUS TUF');
    expect(img).toHaveAttribute('src', '/notebook-asus.jpg');
  });

  it('exibe mensagem de erro quando a API falha', async () => {
    api.get.mockRejectedValueOnce(new Error('Erro na API'));

    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByText(/Não foi possível carregar o produto/i)
      ).toBeInTheDocument()
    );
  });

  it('navega para a página anterior ao clicar em "Voltar"', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        nome: 'Mouse Gamer Redragon Cobra',
        descricao: 'Alta precisão e iluminação RGB.',
        preco: '220.00',
        url_foto: '/mouse-redragon.jpg',
      },
    });

    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByText(/Mouse Gamer Redragon Cobra/i)
      ).toBeInTheDocument()
    );

    const backButton = screen.getByRole('button', { name: /Voltar/i });

    await userEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('navega para a home ao clicar no logo do header', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        nome: 'Teclado Mecânico Logitech',
        descricao: 'Switches mecânicos e iluminação RGB.',
        preco: '550.00',
        url_foto: '/teclado-logitech.jpg',
      },
    });

    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Teclado Mecânico Logitech/i)).toBeInTheDocument()
    );

    const logo = screen.getByAltText('logo');

    await userEvent.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
