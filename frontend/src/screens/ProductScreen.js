import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import { fetchProduct } from '../slices/productsSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addToCart } from '../slices/cartSlice';



const ProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { id: productId } = useParams();

  const [ qty, setQty ] = useState(1)

  const addToCartHandler = ()=>{
    dispatch(addToCart({ ...product, qty }))
    navigate('/')
  }

  // Fetching from the Redux state
  const productsData = useSelector((state) => state.products);
  const { product, productStatus, error } = productsData;

  // Fetch product details
  useEffect(() => {
    
      dispatch(fetchProduct(productId));
    
  }, [dispatch, productId]);

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {productStatus === 'loading' && <Loader/>}
      {productStatus === 'succeeded' && product && (
        <Row>
          <Col md={5}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: AED{product.price}</ListGroup.Item>
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
                      <strong>AED{product.price}</strong>
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
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control 
                          as='select'
                          value={qty}
                          onChange={(e)=> setQty(Number(e.target.value))}>
                          {[...Array(product.countInStock).keys()].map((x)=>(
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
      )}
      {
        productStatus === 'failed' &&
         //<div>{error?.data?.message || error.error}</div> 
         <Message variant='danger'>{error?.data?.message || error.error}</Message>

         }
    </>
  );
};

export default ProductScreen;
