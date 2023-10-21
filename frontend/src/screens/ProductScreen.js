import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import { fetchProduct, createProductReview } from '../slices/productsSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import Meta from '../components/Meta';


const ProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { id: productId } = useParams();

  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const [activeImage, setActiveImage] = useState(0);  // Index of the active/displayed image



  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }))
    navigate('/')
  }

  // Fetching from the Redux state
  const productsData = useSelector((state) => state.products);
  const { product, productStatus, error, createdReviewStatus, reviewError } = productsData;

  const { userInfo } = useSelector((state) => state.auth)


  // Fetch product details
  useEffect(() => {
    dispatch(fetchProduct(productId));
  }, [dispatch, productId]);

  // Function to handle thumbnail click
  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      await dispatch(createProductReview({ productId, review: { rating, comment } })).unwrap()
      await dispatch(fetchProduct(productId)).unwrap()
      if (createdReviewStatus === 'succeeded') {
        toast.success('Review Submitted')
        setRating(0)
        setComment('')
      }

    } catch (err) {
      toast.error(err?.message || err)
    }
  }

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {productStatus === 'loading' ? (<Loader />) :
        productStatus === 'failed' ? (
          <Message variant='danger'>
            {error.message || error}
          </Message>
        ) : productStatus === 'succeeded' && product && (
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
                    <h3>{product.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />
                  </ListGroup.Item>
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
                          <Col>Qty</Col>
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
            <Row className='review'>
              <Col md={6}>
                <h2>Reviews</h2>
                {product.reviews.length === 0 && <Message variant='light'> No Reviews</Message>}
                <ListGroup variant='flush'>
                  {productStatus === 'loading' ? (<Loader />) : product?.reviews?.map(review => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />
                      <p> {review.createdAt?.substring(0, 10)} </p>
                      <p> {review.comment} </p>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item>
                    <h2>Write a Customer Review</h2>
                    {createdReviewStatus === 'loading' && <Loader />}
                    {reviewError && <Message variant='danger'>
                      {reviewError}
                    </Message>}
                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group controlId='rating' className='my-2'>
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            as='select'
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                          >
                            <option value="">Select...</option>
                            <option value="1">1- Poor</option>
                            <option value="2">2- Fair</option>
                            <option value="3">3- Good</option>
                            <option value="4">4- Very Good</option>
                            <option value="5">5- Excellent</option>

                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='comment' className='my-2'>
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as='textarea'
                            row='3'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                        <Button
                          disabled={createdReviewStatus === 'loading'}
                          type='submit'
                          variant='primary'
                        >
                          Submit
                        </Button>
                      </Form>
                    ) : (
                      <Message>
                        Please <Link to='/login'>sign in</Link> to write a review{' '}
                      </Message>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </>
        )}

    </>
  );
};

export default ProductScreen;
