import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PixQRCode from './PixQRCode';
import QRCode from 'qrcode';

jest.mock('qrcode');

describe('PixQRCode component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // mock padrão evita falha no primeiro teste
    QRCode.toDataURL.mockResolvedValue('');
  });

  test('renderiza título e texto padrão', () => {
    render(<PixQRCode payload="123" />);
    expect(screen.getByText('Pagamento via Pix')).toBeInTheDocument();
    expect(screen.getByText('Escaneie o QR Code abaixo:')).toBeInTheDocument();
  });

  test('gera QR Code e renderiza a imagem corretamente', async () => {
    QRCode.toDataURL.mockResolvedValue('data:image/png;base64,abc123');

    render(<PixQRCode payload="12345" />);

    const img = await screen.findByAltText('QR Code Pix');
    expect(img).toHaveAttribute('src', 'data:image/png;base64,abc123');
  });

  test('não renderiza a imagem enquanto não houver URL', () => {
    QRCode.toDataURL.mockResolvedValue('');

    render(<PixQRCode payload="123" />);

    expect(screen.queryByAltText('QR Code Pix')).toBeNull();
  });

  test('exibe erro no console caso falhe ao gerar qrcode', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    QRCode.toDataURL.mockRejectedValue(new Error('erro'));

    render(<PixQRCode payload="123" />);

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });

    spy.mockRestore();
  });
});
