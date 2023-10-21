import { useEffect } from "react";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import CheckoutSteps from "../components/CheckoutSteps";

import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { clearCartItems } from "../slices/cartSlice.js";
import { createOrder } from "../slices/orderSlice";


const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const {  orderError, orderStatus } = useSelector((state) => state.order);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

  const placeOrderHandler = async(e)=>{
    e.preventDefault()
    try {
      const orderData = {
        orderItems: cart.cartItems.map(item => ({
          ...item,
          image: item.images[0]  // Capture only the first image
      })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }

      const orderResponse = await dispatch(createOrder(orderData)).unwrap()

      dispatch(clearCartItems())
      navigate(`/order/${orderResponse._id}`)
    } catch (err) {
      toast.error(err.message || err)
    }
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x AED {item.price} = AED {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                    <ListGroup.Item>
                      <h2>Order Summary</h2>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Items:</Col>
                        <Col>
                          AED { cart.itemsPrice }
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping:</Col>
                        <Col>
                          AED { cart.shippingPrice }
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>VAT:</Col>
                        <Col>
                          AED { cart.taxPrice }
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Total:</Col>
                        <Col>
                          AED { cart.totalPrice }
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      {orderError && <Message variant='danger'>{orderError}</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Button
                      type="button"
                      className="btn-block"
                      disabled={cart.cartItems.length === 0}
                      onClick={placeOrderHandler}
                      >
                        Place Order
                      </Button>
                      {orderStatus === 'loading' && <Loader/>}
                    </ListGroup.Item>

                    

              </ListGroup>
            </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
