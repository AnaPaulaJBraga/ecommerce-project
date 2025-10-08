import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const PixQRCode = ({ payload }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    QRCode.toDataURL(payload)
      .then(setQrCodeUrl)
      .catch((err) => console.error('Erro ao gerar QR Code', err));
  }, [payload]);

  return (
    <div>
      <h3>Pagamento via Pix</h3>
      <p>Escaneie o QR Code abaixo:</p>
      {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code Pix" />}
    </div>
  );
};

export default PixQRCode;
