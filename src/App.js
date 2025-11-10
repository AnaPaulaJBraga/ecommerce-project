import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductPage from './pages/ProductPage/ProductPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import CartPage from './pages/CartPage/CartPage';
import Home from './pages/Home/Home';
import AdminPage from './pages/AdminPage/AdminPage';
import PrivateRoute from './routes/PrivateRoute'; // 👈 importamos aqui
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<PrivateRoute> <AdminPage /> </PrivateRoute>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
