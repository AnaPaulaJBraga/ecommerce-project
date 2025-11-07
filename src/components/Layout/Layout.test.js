import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from './Layout';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

jest.mock('../Header/Header', () =>
  jest.fn(() => <div data-testid="header-mock" />)
);
jest.mock('../Footer/Footer', () =>
  jest.fn(() => <div data-testid="footer-mock" />)
);

describe('Layout component', () => {
  const defaultProps = {
    searchTerm: 'notebook',
    onSearch: jest.fn(),
    onLogoClick: jest.fn(),
    items: [{ id: 1, nome: 'Produto Teste', imagem: '' }],
    onSelectSuggestion: jest.fn(),
  };

  it('renderiza Header e Footer corretamente', () => {
    render(
      <Layout {...defaultProps}>
        <div data-testid="main-content">Conteúdo principal</div>
      </Layout>
    );

    expect(screen.getByTestId('header-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toHaveTextContent(
      'Conteúdo principal'
    );
  });

  it('passa corretamente as props para o Header', () => {
    render(<Layout {...defaultProps} />);

    const firstCallProps = Header.mock.calls[0][0];

    expect(firstCallProps).toEqual(
      expect.objectContaining({
        searchTerm: defaultProps.searchTerm,
        onSearch: defaultProps.onSearch,
        onLogoClick: defaultProps.onLogoClick,
        items: defaultProps.items,
        onSelectSuggestion: defaultProps.onSelectSuggestion,
      })
    );
  });
});
