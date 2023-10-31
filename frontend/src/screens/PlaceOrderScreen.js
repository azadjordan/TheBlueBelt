import { useEffect, useState } from "react";
import { Button, Card, Col, Image, ListGroup, Row, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import CheckoutSteps from "../components/CheckoutSteps";

import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { clearCartItems } from "../slices/cartSlice.js";
import { createOrder } from "../slices/orderSlice";
import { validateCoupon } from "../slices/couponSlice";
import { resetDiscount } from '../slices/couponSlice';





const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);



  const { orderError, orderStatus } = useSelector((state) => state.order);
  const { discount, couponError, couponStatus } = useSelector((state) => state.coupon);

  // Calculate discounted price
  const discountedItemsPrice = Number(cart.itemsPrice) - (Number(cart.itemsPrice) * (Number(discount)));
  const taxAfterDiscount = (discountedItemsPrice * 0.05).toFixed(2)
  const totalAfterDiscount = (Number(taxAfterDiscount) + Number(cart.shippingPrice) + Number(discountedItemsPrice)).toFixed(2)


  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

  const placeOrderHandler = async (e) => {
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
        couponCode: coupon,
      }

      const orderResponse = await dispatch(createOrder(orderData)).unwrap()

      dispatch(clearCartItems())
      navigate(`/order/${orderResponse._id}`)
    } catch (err) {
      toast.error(err.message || err)
    }
  }

  const handleAddCoupon = async () => {
    try {
      // Dispatch the validateCoupon action here
      const result = await dispatch(validateCoupon(coupon)).unwrap();
      console.log(result);

      if (result && result.discountAmount) {
        // Update the cart items price
        // dispatch(applyCouponDiscount(result.discountAmount));
        toast.success(result.message)
        setIsCouponApplied(true);
      }
    } catch (err) {
      // Display a toast notification for the error
      toast.error(err.message || "Failed to apply coupon.");
      setCoupon('')
    }
  };




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
                    AED {discountedItemsPrice.toFixed(2)}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>
                    AED {cart.shippingPrice}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>VAT:</Col>
                  <Col>
                    AED {taxAfterDiscount || cart.taxPrice}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>
                    AED {totalAfterDiscount || cart.totalPrice}
                  </Col>
                </Row>
              </ListGroup.Item>

              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item style={{ backgroundColor: isCouponApplied ? 'lightyellow' : '#f5f5f5' }}>
                    <Row>
                      <h5>Enter a valid coupon:</h5>
                      <Col>
                        <Form.Control
                          type="text"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          placeholder="Enter coupon code"
                          disabled={isCouponApplied}
                        />
                      </Col>
                      {isCouponApplied ? (
                        <Col md="auto">
                          <Button
                            type="button"
                            variant="danger"
                            className=""
                            onClick={() => {
                              setIsCouponApplied(false);
                              setCoupon('');
                              dispatch(resetDiscount());
                            }}
                          >
                            Remove
                          </Button>
                        </Col>
                      ) : (
                        <Col md="auto">
                          <Button
                            type="button"
                            variant="success"
                            className=""
                            onClick={handleAddCoupon}
                          >
                            Add Code
                          </Button>
                        </Col>
                      )}
                    </Row>
                    {isCouponApplied ? (
                      <p style={{ color: 'green' }}>Discount added!</p>
                    ) : null}
                  </ListGroup.Item>
                </ListGroup>
              </Card>



              <ListGroup.Item>
                {orderError && <Message variant='danger'>{orderError.message || orderError}</Message>}
                {orderStatus === 'loading' && <Loader />}
                {couponStatus === 'loading' && <Loader />}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block btn-lg"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
