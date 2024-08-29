import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeContainer from './components/HomeContainer/HomeContainer';
import ProductPage from './components/ProductPage/ProductPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import CartPage from './components/CartPage/CartPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomeContainer />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
