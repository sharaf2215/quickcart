import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import CartPage from './components/CartPage';
import CartSidebar from './components/CartSidebar';
import { products } from './data/products';
import './styles/App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <BrowserRouter>
      <div className="app">
        <Header 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <HomePage 
                products={products}
                searchTerm={searchTerm}
              />
            } />
            
            <Route path="/category/:category" element={
              <CategoryPage products={products} />
            } />
            
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
        
        <CartSidebar />
      </div>
    </BrowserRouter>
  );
}

export default App;
