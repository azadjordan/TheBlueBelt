import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
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
  const [activeFilters, setActiveFilters] = useState(new Set(['special']));

  const specialSearch = (searchKeyword) => {
    setActiveFilters((prevFilters) => {
      const newFilters = new Set(prevFilters);
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
      if (searchKeyword === 'special' && newFilters.has('satin')) {
        newFilters.delete('satin');
      } else if (searchKeyword === 'satin' && newFilters.has('special')) {
        newFilters.delete('special');
      }
      if (newFilters.has(searchKeyword)) {
        newFilters.delete(searchKeyword);
      } else {
        newFilters.add(searchKeyword);
      }
      return newFilters;
    });
    navigate('/?page=1');
  };

  const isButtonDisabled = (buttonKeyword) => {
    if (
      (buttonKeyword === '0.5-inch' && activeFilters.has('1-inch')) ||
      (buttonKeyword === '1-inch' && activeFilters.has('0.5-inch')) ||
      (buttonKeyword === 'special' && activeFilters.has('satin')) ||
      (buttonKeyword === 'satin' && activeFilters.has('special'))
    ) {
      return true;
    }
    if (
      (buttonKeyword === '35-yd' && activeFilters.has('100-yd')) ||
      (buttonKeyword === '100-yd' && activeFilters.has('35-yd'))
    ) {
      return true;
    }
    return false;
  };

  const productsData = useSelector((state) => state.products);
  const { data, productsStatus, error } = productsData;

  useEffect(() => {
    const filters = Array.from(activeFilters).join(',');
    dispatch(fetchProducts({ pageNumber, keyword: filters }));
  }, [dispatch, pageNumber, activeFilters]);

  const getButtonVariant = (buttonKeyword) => {
    return activeFilters.has(buttonKeyword) ? 'primary' : 'light';
  };

  const handleSelect = (k) => {
    specialSearch(k);
  };

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}

      <h1 className='mt-5 mb-4'>Latest Ribbons</h1>
      <Tabs
        defaultActiveKey="special"
        id="filter-tabs"
        className="text-secondary bg-light"
        onSelect={handleSelect}
      >
        <Tab eventKey="special" title="Special"></Tab>
        <Tab eventKey="satin" title="Satin"></Tab>
      </Tabs>

      <div className="my-2">
        {['1-inch', '0.5-inch', '100-yd', '35-yd'].map((keyword) => (
          <Button
            key={keyword}
            variant={getButtonVariant(keyword)}
            disabled={isButtonDisabled(keyword)}
            onClick={() => specialSearch(keyword)}
            className="px-3 mx-1 my-1 home-screen-filter-buttons"
          >
            {keyword.replace('-', ' ')}
          </Button>
        ))}
      </div>

      <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />

      {productsStatus === 'loading' && <Loader />}
      <div className="home-screen-container">
        {productsStatus === 'succeeded' && (
          <>
            <Row>
              {data.products.map((product) => (
                <Col key={product._id} xxl={2} xl={2} lg={2} md={3} sm={4} xs={4}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
      <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />

      {productsStatus === 'succeeded' && data.products.length === 0 && (
        <Message variant="secondary">
          No Results? We might have more in stock! Please contact customer service for assistance and the latest inventory updates.
        </Message>
      )}
      {productsStatus === 'failed' && <Message variant="danger">{error?.data?.message || error.error || error}</Message>}
    </>
  );
};

export default HomeScreen;
