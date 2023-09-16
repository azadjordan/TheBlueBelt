import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchOrder } from "../slices/orderSlice";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrder(orderId));
  }, [dispatch, orderId]);

  const { order, orderStatus, error } = useSelector((state) => state.order);

  // here.. get the action to pay
  // const {payOrder, isLoading: loadingPay} =

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // here.. get the action that gets the paypal client id
  // const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} =

  const { userInfo } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (!errorPayPal && ! loadingPayPal && paypal.clientId) {
  //     const loadPayPalScript = async () => {
  //     paypalDispatch({
  //     type: 'resetOptions',
  //     value: {
  //     'client-id': paypal.clientId,
  //     currency: 'AED'
  //     }
  //     });
  //     paypalDispatch({ type: 'setLoadingStatus', value: 'pending' }) ;
  //     }
  //     if (order && !order.isPaid) {
  //     if (!window.paypal) {
  //     loadPayPalScript();
  //     }
  //     }
  //     }
  // }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal])

  function onApprove(){}
  function onApproveTest(){}
  function onError(){}
  function createOrder(){}

  return (
    <>
      {error && <Message variant="danger">{error}</Message>}
      {orderStatus === "loading" ? (
        <Loader />
      ) : (
        order && (
          <>
            <h1>Order {order._id}</h1>
            <Row>
              <Col md={8}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p>
                      <strong>Name: </strong> {order.user.name}
                    </p>
                    <p>
                      <strong>Email: </strong> {order.user.email}
                    </p>
                    <p>
                      <strong>Address: </strong>
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city}{" "}
                      {order.shippingAddress.postalCode},{" "}
                      {order.shippingAddress.country}
                    </p>
                    {order.isDelivered ? (
                      <Message variant="success">
                        Delivered on {order.deliveredAt}
                      </Message>
                    ) : (
                      <Message variant="danger">Not Delivered</Message>
                    )}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                      {" "}
                      <strong>Method: </strong>
                      {order.paymentMethod}
                    </p>
                    {order.isPaid ? (
                      <Message variant="success">
                        Paid on {order.paidAt}
                      </Message>
                    ) : (
                      <Message variant="danger">Not Paid</Message>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h2>Order Items</h2>
                    {order.orderItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} × AED {item.price} = AED{" "}
                            {item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
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
                        <Col>Items</Col>
                        <Col>AED {order.itemsPrice}</Col>
                      </Row>
                      <Row>
                        <Col>Shipping</Col>
                        <Col>AED {order.shippingPrice}</Col>
                      </Row>
                      <Row>
                        <Col>Tax</Col>
                        <Col>AED {order.taxPrice}</Col>
                      </Row>
                      <Row>
                        <Col>Total</Col>
                        <Col>AED {order.totalPrice}</Col>
                      </Row>
                    </ListGroup.Item>
                    {!order.isPaid && (
                      <ListGroup.Item>
                        {/* {loadingPay && <Loader />} */}
                        {isPending ? (
                          <Loader />
                        ) : (
                          <div>
                            <Button
                              onClick={onApproveTest}
                              style={{ marginBottom: "10px" }}
                            >
                              Test Pay Order
                            </Button>
                            <div>
                              <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}></PayPalButtons>
                            </div>
                          </div>
                        )}
                      </ListGroup.Item>
                    )}
                    {/* MARK AS DELIVERED */}
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </>
        )
      )}
    </>
  );
};

export default OrderScreen;
