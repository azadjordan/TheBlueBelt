import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message.js";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    < >
      <h1 style={{ marginBottom: "20px" }}>Shopping Cart</h1>
      <Row className='mt-5'>
        <Col xs={12}  md={8} style={{paddingBottom: '30px'}}>
          {cartItems?.length === 0 ? (
            <Message>
              Your cart is empty <Link to="/">Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems?.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col xs={3}>
                      <Image src={item.images[0]} alt={item.name} fluid rounded />
                    </Col>
                    <Col xs={9}>
                      <Row className="d-flex">
                        <Col xs={9}>
                          <div>
                            <strong>Item: </strong>
                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                          </div>
                        </Col>
                        <Col xs={3}>
                          <Button
                            style={{ marginLeft: "10%" }}
                            type="button"
                            variant="light"
                            onClick={() => removeFromCartHandler(item._id)}
                          >
                            <FaTrash/>
                          </Button>
                        </Col>
                      </Row>
                      <div>
                        <strong>Price:</strong> AED {item.price}
                      </div>
                      <div>
                        <strong>Size:</strong> {item.dimensions}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", marginTop: '5px' }}>
                        <strong style={{ marginRight: "10px" }}>
                          Quantity:
                        </strong>
                        <Form.Control
                          style={{ maxWidth: "70px", maxHeight: '35px' }}
                          as="select"
                          value={item.qty}
                          onChange={(e) =>
                            addToCartHandler(item, Number(e.target.value))
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col xs={12}  md={4} >
          <Card >
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h5>
                  Items in cart: <span style={{fontSize: '1.5rem'}}>{cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}</span>
                </h5>
                </ListGroup.Item>
                <ListGroup.Item>
                <h5>
                  Total Price: AED{" "}
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </h5>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartScreen;
