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

  // const { userInfo  } = useSelector((state) => state.auth)


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
      <Link className="btn btn-light my-3" to="/">Go Back</Link>
  
      {productStatus === 'loading' ? (<Loader />) :
        productStatus === 'failed' ? (
          <Message variant='danger'>
            {error?.message || error}
          </Message>
        ) : productStatus === 'succeeded' && (
          <>
            <Meta title={product.name} />
  
            <Row>
              <Col xs={12} md={6}>
                {/* Main Image and Thumbnails */}
                <div className="product-image-container">
                  <Image className="d-block zoom-effect" src={product.images[activeImage]} alt={product.name} fluid />
                </div>
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
  
                {/* Add to Cart Section */}
                <Card className="mt-3">
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
                        <Col>Product Status:</Col>
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
  
              <Col xs={12} md={6}>
                {/* Product Details */}
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>{product.name}</h2>
                  </ListGroup.Item>
                  <ListGroup.Item> Size: <strong>{product.dimensions}</strong> </ListGroup.Item>
                  <ListGroup.Item>Price: AED {product.price}</ListGroup.Item>
                  <ListGroup.Item>Description: {product.description}</ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </>
        )}
    </>
  );
};

export default ProductScreen;
