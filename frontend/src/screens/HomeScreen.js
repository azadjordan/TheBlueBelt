import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product.js';
import { fetchProducts } from '../slices/productsSlice.js';
import Loader from '../components/Loader.js';
import Message from '../components/Message.js';



const HomeScreen = () => {
  const dispatch = useDispatch();
  
  // Fetching from the Redux state
  const productsData = useSelector((state) => state.products);
  const { products, productsStatus, error } = productsData;
  // Fetch products
  useEffect(() => {
    
      dispatch(fetchProducts());
    
  }, [dispatch]);
  
  return (
    <>
      <h1>Latest Products</h1>
      {productsStatus === 'loading' && <Loader/>}
      {productsStatus === 'succeeded' && (
        <Row>
          {products.map((product) => (
            <Col key={product._id} xs={6} sm={6} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
      {
        productsStatus === 'failed' && 
        //<div>{error?.data?.message || error.error}</div>
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      }
    </>
  );
};

export default HomeScreen;
