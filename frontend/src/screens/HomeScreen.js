import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product.js';
import { fetchProducts } from '../slices/productsSlice.js';
import Loader from '../components/Loader.js';
import Message from '../components/Message.js';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate.js';
import ProductCarousel from '../components/ProductCarousel.js';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { pageNumber, keyword } = useParams();
  // Fetching from the Redux state
  const productsData = useSelector((state) => state.products);
  const { data, productsStatus, error } = productsData;

  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts({ pageNumber, keyword }));
  }, [dispatch, pageNumber, keyword]);

  return (
    <>
      {!keyword ? <ProductCarousel /> : (<Link to='/' className='btn btn-light mb-4'>
        Go Back
      </Link>)}

      <h1>Latest Products</h1>
      {productsStatus === 'loading' && <Loader />}
      {productsStatus === 'succeeded' && (
        <>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} xs={6} sm={6} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />
        </>
      )}
      {
        productsStatus === 'failed' &&
        <Message variant='danger'>{error?.data?.message || error.error || error}</Message>
      }
    </>
  );
};

export default HomeScreen;
