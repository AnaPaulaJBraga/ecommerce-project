import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminPage from './AdminPage';
import api from '../../api';

jest.mock('../../api');

describe('AdminPage', () => {
  const renderComponent = (props = {}) =>
    render(
      <BrowserRouter>
        <AdminPage {...props} />
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'Produto Teste' },
    });

    fireEvent.change(screen.getByLabelText(/preço/i), {
      target: { value: '49.90' },
    });

    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: 'Descrição Teste' },
    });

    fireEvent.change(screen.getByLabelText(/url da foto/i), {
      target: { value: 'http://example.com/img.png' },
    });
  };

  const getSubmitButton = () =>
    screen.getAllByRole('button', { name: /cadastrar produto/i })[0];

  it('envia o formulário com os valores corretos', async () => {
    api.post.mockResolvedValueOnce({
      data: { message: 'Produto cadastrado com sucesso!' },
    });

    renderComponent();

    fillForm();
    fireEvent.click(getSubmitButton());

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith('/produtos/', {
        nome: 'Produto Teste',
        preco: '49.90',
        descricao: 'Descrição Teste',
        url_foto: 'http://example.com/img.png',
      })
    );
  });

  it('exibe erro caso o cadastro falhe', async () => {
    api.post.mockRejectedValueOnce(new Error('Erro API'));

    renderComponent();

    fillForm();
    fireEvent.click(getSubmitButton());

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        '❌ Erro ao cadastrar o produto'
      )
    );
  });

  it('seedProdutos – usa seedList mockada e chama api.post para cada item', async () => {
    const mockSeed = [
      {
        nome: 'P1',
        preco: 1.1,
        descricao: 'd1',
        url_foto: 'http://ok/img1.png',
      },
      {
        nome: 'P2',
        preco: 2.2,
        descricao: 'd2',
        url_foto: 'http://ok/img2.png',
      },
    ];

    api.post.mockResolvedValue({});

    renderComponent({ seedList: mockSeed });

    const seedButton = screen.getByRole('button', {
      name: /cadastrar produtos padrão/i,
    });
    fireEvent.click(seedButton);

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledTimes(mockSeed.length)
    );

    expect(api.post).toHaveBeenCalledWith('/produtos/', mockSeed[0]);
    expect(api.post).toHaveBeenCalledWith('/produtos/', mockSeed[1]);

    expect(window.alert).toHaveBeenCalledWith(
      '🎉 Todos os produtos foram cadastrados com sucesso!'
    );
  });
});
