import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe('Header component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o logo e os links principais', () => {
    render(<Header />, { wrapper: MemoryRouter });

    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByText('Cadastro')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Carrinho')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('deve chamar onLogoClick e navegar para "/" ao clicar no logo', () => {
    const mockLogoClick = jest.fn();
    render(<Header onLogoClick={mockLogoClick} />, { wrapper: MemoryRouter });

    const logo = screen.getByAltText('logo');
    fireEvent.click(logo);

    expect(mockLogoClick).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('deve atualizar o valor de busca quando o usuário digita', () => {
    const mockOnSearch = jest.fn();
    render(<Header onSearch={mockOnSearch} searchTerm="" />, {
      wrapper: MemoryRouter,
    });

    const input = screen.getByPlaceholderText('Buscar produtos...');
    fireEvent.change(input, { target: { value: 'Notebook' } });

    expect(mockOnSearch).toHaveBeenCalledWith('Notebook');
  });

  it('deve renderizar sugestões quando searchTerm e items estão definidos', () => {
    const mockOnSelect = jest.fn();
    const items = [
      { id: 1, nome: 'Produto A', imagem: 'https://img.com/a.jpg' },
      { id: 2, nome: 'Produto B', imagem: 'https://img.com/b.jpg' },
    ];

    render(
      <Header
        searchTerm="Produto"
        onSearch={jest.fn()}
        onSelectSuggestion={mockOnSelect}
        items={items}
      />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText('Produto A')).toBeInTheDocument();
    expect(screen.getByText('Produto B')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Produto A'));
    expect(mockOnSelect).toHaveBeenCalledWith(items[0]);
  });

  it('deve chamar onSearch("") ao clicar fora da barra de busca', () => {
    const mockOnSearch = jest.fn();
    const { container } = render(
      <Header onSearch={mockOnSearch} searchTerm="abc" />,
      {
        wrapper: MemoryRouter,
      }
    );

    fireEvent.mouseDown(container);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});
