import React, { useEffect, useState } from 'react';
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
  const navigate = useNavigate();

  const [activeFilters, setActiveFilters] = useState(new Set());


  const specialSearch = (searchKeyword) => {
    setActiveFilters(prevFilters => {
      const newFilters = new Set(prevFilters);

      // Handle mutually exclusive scenarios for lengths
      if (searchKeyword === '1-inch' && newFilters.has('0.5-inch')) {
        newFilters.delete('0.5-inch');
      } else if (searchKeyword === '0.5-inch' && newFilters.has('1-inch')) {
        newFilters.delete('1-inch');
      }

      if (searchKeyword === '100-yd' && newFilters.has('35-yd')) {
        newFilters.delete('35-yd');
      } else if (searchKeyword === '35-yd' && newFilters.has('100-yd')) {
        newFilters.delete('100-yd');
      }

      // Handle mutually exclusive scenarios for types
      if (searchKeyword === 'special' && newFilters.has('satin')) {
        newFilters.delete('satin');
      } else if (searchKeyword === 'satin' && newFilters.has('special')) {
        newFilters.delete('special');
      }

      // Toggle the clicked filter
      if (newFilters.has(searchKeyword)) {
        newFilters.delete(searchKeyword);
      } else {
        newFilters.add(searchKeyword);
      }
      return newFilters;
    });
  };

    // Function to determine if a button should be disabled
    const isButtonDisabled = (buttonKeyword) => {
      if ((buttonKeyword === '0.5-inch' && activeFilters.has('1-inch')) || 
          (buttonKeyword === '1-inch' && activeFilters.has('0.5-inch')) ||
          (buttonKeyword === 'special' && activeFilters.has('satin')) ||
          (buttonKeyword === 'satin' && activeFilters.has('special'))) {
        return true;
      }
      if ((buttonKeyword === '35-yd' && activeFilters.has('100-yd')) || 
          (buttonKeyword === '100-yd' && activeFilters.has('35-yd'))) {
        return true;
      }
      return false;
    };
  


  // Fetching from the Redux state
  const productsData = useSelector((state) => state.products);
  const { data, productsStatus, error } = productsData;

  // Fetch products
  useEffect(() => {
    const filters = Array.from(activeFilters).join(',');
    dispatch(fetchProducts({ pageNumber, keyword: filters }));
  }, [dispatch, pageNumber, activeFilters]);  


  // Function to get button variant
  const getButtonVariant = (buttonKeyword) => {
    return activeFilters.has(buttonKeyword) ? 'primary' : 'light';
  };
  

  return (
    <>
      {!keyword ? <ProductCarousel /> : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}

      <h1>Latest Ribbons</h1>
      {/* Special search buttons */}
      <div className="my-3">
        <Button variant={getButtonVariant('special')} disabled={isButtonDisabled('special')} onClick={() => specialSearch('special')}>
          Special
        </Button>
        <Button variant={getButtonVariant('satin')} disabled={isButtonDisabled('satin')} onClick={() => specialSearch('satin')}>
          Satin
        </Button>
        <Button variant={getButtonVariant('1-inch')} disabled={isButtonDisabled('1-inch')} onClick={() => specialSearch('1-inch')}>
          1 inch
        </Button>
        <Button variant={getButtonVariant('0.5-inch')} disabled={isButtonDisabled('0.5-inch')} onClick={() => specialSearch('0.5-inch')}>
          0.5 inch
        </Button>
        <Button variant={getButtonVariant('100-yd')} disabled={isButtonDisabled('100-yd')} onClick={() => specialSearch('100-yd')}>
          100 yards
        </Button>
        <Button variant={getButtonVariant('35-yd')} disabled={isButtonDisabled('35-yd')} onClick={() => specialSearch('35-yd')}>
          35 yards
        </Button>
      </div>
      {productsStatus === 'loading' && <Loader />}
      {productsStatus === 'succeeded' && (
        <>
          <Row style={{ marginBottom: '20px' }}>
            {data.products.map((product) => (
              <Col key={product._id} xs={6} sm={6} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />
        </>
      )}
      {productsStatus === 'failed' &&
        <Message variant='danger'>{error?.data?.message || error.error || error}</Message>
      }
    </>
  );
};

export default HomeScreen;
