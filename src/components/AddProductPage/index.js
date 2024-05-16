import React from 'react';
import { Link } from 'react-router-dom';
import AddProductForm from '../AddProductForm';
import './index.css'

const AddProductPage = () => {
  return (
    <div className='addproduct-con'>
      <AddProductForm />
      <Link to="/products">Back to Product List</Link>
    </div>
  );
};

export default AddProductPage;
