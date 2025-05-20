// src/components/Layout/Layout.jsx
import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = ({ children, searchTerm, onSearch, onLogoClick }) => {
  return (
    <>
      <Header
        searchTerm={searchTerm}
        onSearch={onSearch}
        onLogoClick={onLogoClick}
      />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
