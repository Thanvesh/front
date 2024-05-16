import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import AddProductPage from './components/AddProductPage';
import Home from './components/Home';
import { ProductProvider } from './Context/ProductContext';
import NotFoundPage from './components/NotFound';

const App = () => {
  return (
    <Router>
      <ProductProvider>
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/products" exact element={<ProductList/>} />
          <Route path="/add-product" exact element={<AddProductPage/>} />
          <Route path='*' element={<NotFoundPage/>}/>
        </Routes>
      </ProductProvider>
    </Router>
  );
};

export default App;
