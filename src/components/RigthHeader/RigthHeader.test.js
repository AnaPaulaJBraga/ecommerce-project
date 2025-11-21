import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RigthHeader from './RigthHeader';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RigthHeader component', () => {
  const mockOnLogoClick = jest.fn();
  const mockOnSearch = jest.fn();

  const renderComponent = (children = null, props = {}) => {
    return render(
      <BrowserRouter>
        <RigthHeader
          onLogoClick={mockOnLogoClick}
          onSearch={mockOnSearch}
          {...props}
        >
          {children}
        </RigthHeader>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente os links do header', () => {
    renderComponent();

    expect(screen.getByText('Cadastro')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Carrinho')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renderiza o children no main', () => {
    renderComponent(<p>Conteúdo interno</p>);

    expect(screen.getByText('Conteúdo interno')).toBeInTheDocument();
  });

  it('chama onLogoClick ao clicar no logo', () => {
    renderComponent();
    fireEvent.click(screen.getByAltText('logo'));

    expect(mockOnLogoClick).toHaveBeenCalledTimes(1);
  });

  it('navega para "/" ao clicar no logo', () => {
    renderComponent();
    fireEvent.click(screen.getByAltText('logo'));

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('não quebra caso onLogoClick não seja fornecido', () => {
    renderComponent(null, { onLogoClick: undefined });

    fireEvent.click(screen.getByAltText('logo'));

    // Se não quebrou, está ok
    expect(true).toBe(true);
  });

  it('verifica se os links apontam para as rotas corretas', () => {
    renderComponent();

    expect(screen.getByText('Cadastro').closest('a')).toHaveAttribute(
      'href',
      '/register'
    );
    expect(screen.getByText('Login').closest('a')).toHaveAttribute(
      'href',
      '/login'
    );
    expect(screen.getByText('Carrinho').closest('a')).toHaveAttribute(
      'href',
      '/cart'
    );
    expect(screen.getByText('Admin').closest('a')).toHaveAttribute(
      'href',
      '/admin'
    );
  });

  it('chama onSearch ao digitar na barra de pesquisa', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Buscar produtos...');

    fireEvent.change(input, { target: { value: 'notebook' } });

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('notebook');
  });

  it('altera o state interno searchTerm ao digitar', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Buscar produtos...');

    fireEvent.change(input, { target: { value: 'mouse' } });

    expect(input.value).toBe('mouse');
  });

  it('não quebra caso onSearch não seja fornecido', () => {
    renderComponent(null, { onSearch: undefined });

    const input = screen.getByPlaceholderText('Buscar produtos...');

    fireEvent.change(input, { target: { value: 'abc' } });

    expect(true).toBe(true);
  });
});
