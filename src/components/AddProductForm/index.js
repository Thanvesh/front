import React, { useContext, useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { ProductContext } from '../../Context/ProductContext'; // Import ProductContext
import './index.css'; // Import custom styles

const { Option } = Select;

const AddProductForm = () => {
  const { setProducts } = useContext(ProductContext); // Get setProducts function from ProductContext
  const [newProduct, setNewProduct] = useState({
    category: '',
    name: '',
    description: '',
    price: '',
  });
  const [successMessageVisible, setSuccessMessageVisible] = useState(""); // State to manage visibility of success message
  const navigate = useNavigate(); // Get navigate function for redirection

  const categories = ['Mobile', 'Clothes', 'Electronics', 'Home Appliances', 'Vehicles'];

  const handleChange = (key, value) => {
    setNewProduct({ ...newProduct, [key]: value });
  };

  const handleSubmit = () => {
    axios.post(`https://end-server.onrender.com/products`, newProduct)
      .then(response => {
        setProducts(prevProducts => [...prevProducts, newProduct]);
        message.success(response.message) // Add new product to the product list
        setSuccessMessageVisible(response.message); // Display success message
        setTimeout(() => {
          setSuccessMessageVisible(""); // Hide success message after 1 second
          navigate('/products'); // Redirect to the ProductList page after adding the product
        }, 1000);
      })
      .catch(error => {
        console.error('Error adding product:', error);
      });
  };

  return (
    <div className="add-product-page">
      <div className="add-product-form-container">
        <h1 className="add-product-heading">Add New Product</h1>
        <Form className="add-product-form">
          <Form.Item label="Category" className="input-label">
            <Select
              value={newProduct.category}
              onChange={value => handleChange('category', value)}
              placeholder="Select category"
            >
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Name" className="input-label">
            <Input value={newProduct.name} onChange={e => handleChange('name', e.target.value)} />
          </Form.Item>
          <Form.Item label="Description" className="input-label">
            <Input.TextArea value={newProduct.description} onChange={e => handleChange('description', e.target.value)} />
          </Form.Item>
          <Form.Item label="Price" className="input-label">
            <Input type="number" value={newProduct.price} onChange={e => handleChange('price', e.target.value)} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSubmit} className="add-product-button">Add Product</Button>
          </Form.Item>
        </Form>
        {successMessageVisible !== "" && (
          <div className="success-message">{successMessageVisible}. Redirecting...</div>
        )}
      </div>
    </div>
  );
};

export default AddProductForm;
