import React from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Produto {id}</h1>
      <p>Detalhes do produto {id} vão aqui.</p>
    </div>
  );
};

export default ProductPage;
