import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer component', () => {
  it('deve renderizar o título "Redes Sociais"', () => {
    render(<Footer />);
    expect(screen.getByText(/Redes Sociais/i)).toBeInTheDocument();
  });

  it('deve renderizar os ícones das redes sociais', () => {
    render(<Footer />);

    expect(screen.getAllByTestId('icon')).toHaveLength(3);
  });

  it('deve exibir o texto de direitos autorais com o ano atual', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const text = screen.getByText(
      new RegExp(
        `© ${currentYear} InfoWord\\. Todos os direitos reservados\\.`
      )
    );

    expect(text).toBeInTheDocument();
  });
});
