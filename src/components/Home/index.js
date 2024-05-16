import React from 'react';
import { Link } from 'react-router-dom';
import './Parallax.css'; // Import CSS for styling

const Home = () => {
  return (
    <div className="parallax">
      <div className="parallax-content">
        <h1 className="falling-text">Welcome</h1>
        <p>Product Management System</p>
        <Link to="/products">
          <button className="btn">View Products</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
