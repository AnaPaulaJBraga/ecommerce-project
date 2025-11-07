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

  const renderComponent = (children = null) => {
    return render(
      <BrowserRouter>
        <RigthHeader onLogoClick={mockOnLogoClick}>{children}</RigthHeader>
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

    const logo = screen.getByAltText('logo');
    fireEvent.click(logo);

    expect(mockOnLogoClick).toHaveBeenCalledTimes(1);
  });

  it('navega para "/" ao clicar no logo', () => {
    renderComponent();

    const logo = screen.getByAltText('logo');
    fireEvent.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
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
});
