import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd'; // Import message from antd
import axios from 'axios'; // Import Axios for HTTP requests

const EditProductForm = ({ product, closeModal }) => {

  const [editedProduct, setEditedProduct] = useState(product);

  const handleChange = (key, value) => {
    setEditedProduct({ ...editedProduct, [key]: value });
  };

  const handleSubmit = () => {
    axios.put(`http://localhost:5000/products/${editedProduct.id}`, editedProduct)
      .then(response => {
        // Update product in the frontend state
        message.success(response.message); // Display success message
        setTimeout(() => {
            closeModal(); // Close modal after 1 second
          }, 1000);
      })
      .catch(error => {
        console.error('Error updating product:', error);
      });
  };

  return (
    <div>
      <Form>
        <Form.Item label="Category">
          <Input value={editedProduct.category} onChange={e => handleChange('category', e.target.value)} />
        </Form.Item>
        <Form.Item label="Name">
          <Input value={editedProduct.name} onChange={e => handleChange('name', e.target.value)} />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea value={editedProduct.description} onChange={e => handleChange('description', e.target.value)} />
        </Form.Item>
        <Form.Item label="Price">
          <Input type="number" value={editedProduct.price} onChange={e => handleChange('price', e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>Save Changes</Button>
          <Button onClick={closeModal}>Cancel</Button>
        </Form.Item>
      </Form>
      
    </div>
  );
};

export default EditProductForm;
