import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductPage from './ProductPage';
import api from './../../api';
import { MemoryRouter } from 'react-router-dom';

jest.mock('./../../api');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '101' }),
}));

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
        preco: 'R$ 6.500,00',
        url_foto: '/notebook-asus.jpg',
      },
    });

    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );

    // Verifica se o loading aparece primeiro
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/Notebook Gamer ASUS TUF/i)).toBeInTheDocument()
    );

    expect(screen.getByText(/Alto desempenho/i)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 6\.500,00/i)).toBeInTheDocument();

    // Seleciona a imagem correta entre todas
    const images = screen.getAllByRole('img');
    const productImage = images.find(
      (img) => img.getAttribute('alt') === 'Notebook Gamer ASUS TUF'
    );
    expect(productImage).toHaveAttribute('src', '/notebook-asus.jpg');
  });

  it('exibe mensagem de erro quando a API falha', async () => {
    api.get.mockRejectedValueOnce(new Error('Erro na API'));

    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Erro ao buscar produto/i)).toBeInTheDocument()
    );
  });

  it('navega para a home ao clicar em "Voltar"', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        nome: 'Mouse Gamer Redragon Cobra',
        descricao: 'Alta precisão e iluminação RGB.',
        preco: 'R$ 220,00',
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

    userEvent.click(screen.getByRole('button', { name: /Voltar/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('navega para a home ao clicar no logo do header', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        nome: 'Teclado Mecânico Logitech',
        descricao: 'Switches mecânicos e iluminação RGB.',
        preco: 'R$ 550,00',
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

    // Clica no logo (primeira imagem do header)
    const images = screen.getAllByRole('img');
    const logo = images.find((img) => img.getAttribute('alt') === 'logo');
    userEvent.click(logo);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});
