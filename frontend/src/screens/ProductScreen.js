import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import { fetchProduct } from '../slices/productsSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addToCart } from '../slices/cartSlice';
import Meta from '../components/Meta';


const ProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { id: productId } = useParams();

  const [qty, setQty] = useState(1)


  const [activeImage, setActiveImage] = useState(0);  // Index of the active/displayed image



  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }))
    navigate('/')
  }

  // Fetching from the Redux state
  const productsData = useSelector((state) => state.products);
  const { product, productStatus, error,   } = productsData;

  const { userInfo  } = useSelector((state) => state.auth)


  // Fetch product details
  useEffect(() => {
    dispatch(fetchProduct(productId));
  }, [dispatch, productId]);

  // Function to handle thumbnail click
  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {productStatus === 'loading' || !userInfo ? (<Loader />) :
        productStatus === 'failed' ? (
          <Message variant='danger'>
            {error?.message || error}
          </Message>
        ) : productStatus === 'succeeded' && (
          <>
            <Meta title={product.name} />

            <Row>
              <Col md={5}>
                {/* Main Image */}
                <div className="product-image-container">
                  <Image className="d-block w-100" src={product.images[activeImage]} alt={product.name} fluid />
                </div>

                {/* Thumbnails */}
                <Row className="mt-3">
                  {product.images.map((imgUrl, index) => (
                    <Col xs={4} md={3} key={index}>
                      <Image
                        src={imgUrl}
                        alt={`Thumbnail ${index}`}
                        onClick={() => handleThumbnailClick(index)}
                        className={index === activeImage ? 'active-thumbnail' : ''}
                        fluid
                        thumbnail
                      />
                    </Col>
                  ))}
                </Row>
              </Col>
              <Col md={4}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>{product.name}</h2>
                  </ListGroup.Item>
                  {/* <ListGroup.Item>
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />
                  </ListGroup.Item> */}
                  <ListGroup.Item> Size: <strong>{product.dimensions}</strong> </ListGroup.Item>
                  <ListGroup.Item>Price: AED {product.price}</ListGroup.Item>
                  <ListGroup.Item>Description: {product.description}</ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>
                          <strong>AED {product.price}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>productStatus:</Col>
                        <Col>
                          <strong>
                            {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                          </strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <Row>
                          <Col>Quantity</Col>
                          <Col>
                            <Form.Control
                              as='select'
                              value={qty}
                              onChange={(e) => setQty(Number(e.target.value))}>
                              {[...Array(product.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )}

                    <ListGroup.Item>
                      <Button
                        className="btn-block"
                        type="button"
                        disabled={product.countInStock === 0}
                        onClick={addToCartHandler}
                      >
                        Add To Cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </>
        )}

    </>
  );
};

export default ProductScreen;
