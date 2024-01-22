import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import Product from '../components/Product.js';
import { fetchProducts } from '../slices/productsSlice.js';
import Loader from '../components/Loader.js';
import Message from '../components/Message.js';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate.js';
import ProductCarousel from '../components/ProductCarousel.js';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { pageNumber, keyword } = useParams();
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
    navigate('/?page=1'); 

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

  const buttonsData = [
    { text: 'Special', keyword: 'special' },
    { text: 'Satin', keyword: 'satin' },
    { text: '1 inch', keyword: '1-inch' },
    { text: '0.5 inch', keyword: '0.5-inch' },
    { text: '100 yards', keyword: '100-yd' },
    { text: '35 yards', keyword: '35-yd' },
    
  ];
  

  return (
    <>
      {!keyword ? <ProductCarousel /> : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}

      <h1>Latest Ribbons</h1>
      {/* Special search buttons */}
      <div className="my-4">
        {buttonsData.map(({ text, keyword }) => (
          <Button
            key={keyword}
            variant={getButtonVariant(keyword)}
            disabled={isButtonDisabled(keyword)}
            onClick={() => specialSearch(keyword)}
            className="px-3 mx-1 my-1 home-screen-filter-buttons"
          >
            {text}
          </Button>
        ))}

        
      </div>

      <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />

      {productsStatus === 'loading' && <Loader />}
      {productsStatus === 'succeeded' && (
        <>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} xxl={2} xl={3} lg={3} md={4} sm={6} xs={6}  >
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />
        </>
      )}
      {productsStatus === 'succeeded' && data.products.length === 0 && (
        <Message variant='secondary'>No Results? We might have more in stock! Please contact customer service for assistance and the latest inventory updates.</Message>
      )}
      {productsStatus === 'failed' &&
        <Message variant='danger'>{error?.data?.message || error.error || error}</Message>
      }
    </>
  );
};

export default HomeScreen;
