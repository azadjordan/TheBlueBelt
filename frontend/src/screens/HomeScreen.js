import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import Product from '../components/Product.js';
import { fetchProducts } from '../slices/productsSlice.js';
import Loader from '../components/Loader.js';
import Message from '../components/Message.js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate.js';
import ProductCarousel from '../components/ProductCarousel.js';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { pageNumber, keyword } = useParams();
  const navigate = useNavigate()

  const specialSearch = (keyword) => {
    navigate(`/search/${keyword}`);
  };

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

      <h1>Latest Ribbons</h1>
      {/* Special search buttons */}
      <div className="my-3">
        <Button variant="light" className="mx-1" onClick={() => specialSearch('special')}>
          Special
        </Button>
        <Button variant="light" className="mx-1" onClick={() => specialSearch('satin')}>
          Satin
        </Button>
        <Button variant="light" className="mx-1" onClick={() => specialSearch('W10')}>
          1 inch
        </Button>
        <Button variant="light" className="mx-1" onClick={() => specialSearch('W05')}>
          0.5 inch
        </Button>
        <Button variant="light" className="mx-1" onClick={() => specialSearch('L100')}>
          100 yards
        </Button>
        <Button variant="light" className="mx-1" onClick={() => specialSearch('L35')}>
          35 yards
        </Button>
      </div>
      {productsStatus === 'loading' && <Loader />}
      {productsStatus === 'succeeded' && (
        <>
          <Row style={{marginBottom: '20px'}}>
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
