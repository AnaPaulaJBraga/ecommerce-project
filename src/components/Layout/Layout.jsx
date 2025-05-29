import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = ({ children, searchTerm, onSearch, onLogoClick, items = [], onSelectSuggestion }) => {
  return (
    <>
      <Header
        searchTerm={searchTerm}
        onSearch={onSearch}
        onLogoClick={onLogoClick}
        items={items}
        onSelectSuggestion={onSelectSuggestion}
      />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
