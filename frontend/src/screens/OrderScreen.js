import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchOrder, updateOrderToDelivered } from "../slices/orderSlice";
import { toast } from "react-toastify";


const OrderScreen = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch the order details for this specific order ID
    dispatch(fetchOrder(orderId));
  }, [dispatch, orderId]);

  // get the placed order:
  const { singleOrder, orderStatus, orderError } = useSelector(
    (state) => state.order
  );

  // get the update order to delivered fields
  const { deliveredOrderStatus } = useSelector((state) => state.order)

  // get the user info:
  const { userInfo } = useSelector((state) => state.auth);


  const deliverOrderHandler = async () => {
    try {
      await dispatch(updateOrderToDelivered(orderId)).unwrap()
      await dispatch(fetchOrder(orderId)).unwrap();  // Re-fetch the order details
      toast.success('Order delivered')
    } catch (err) {
      toast.error(err?.data?.message || err.message)
    }
  }

  return (
    <>
      {orderError && <Message variant="danger">{orderError}</Message>}
      {orderStatus === "loading" ? (
        <Loader />
      ) : userInfo && singleOrder && orderStatus === 'succeeded' && (
        <>
          <h1>Order {singleOrder._id}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong> {singleOrder?.user?.name}
                  </p>
                  <p>
                    <strong>Email: </strong> {singleOrder?.user?.email}
                  </p>
                  <p>
                    <strong>Address: </strong>
                    {singleOrder.shippingAddress?.address},{" "}
                    {singleOrder.shippingAddress?.city}{" "}
                    {singleOrder.shippingAddress?.postalCode},{" "}
                    {singleOrder.shippingAddress?.country}
                  </p>
                  {singleOrder.isDelivered ? (
                    <Message variant="success">
                      Delivered on {singleOrder.deliveredAt}
                    </Message>
                  ) : (
                    <Message variant="warning">Not Delivered</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    {" "}
                    <strong>Method: </strong>
                    {singleOrder.paymentMethod}
                  </p>
                  {singleOrder.isPaid ? (
                    <Message variant="success">
                      Paid on {singleOrder.paidAt}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {singleOrder?.orderItems?.map((item, index) => (
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
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} × AED {item.price} = AED{" "}
                          {(item.qty * item.price).toFixed(2)}
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
                      <Col>AED {singleOrder.itemsPrice}</Col>
                    </Row>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>AED {singleOrder.shippingPrice}</Col>
                    </Row>
                    <Row>
                      <Col>Tax</Col>
                      <Col>AED {singleOrder.taxPrice}</Col>
                    </Row>
                    <Row>
                      <Col>Total</Col>
                      <Col>AED {singleOrder.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>

                  {deliveredOrderStatus === 'loading' && <Loader />}

                  {userInfo && userInfo.isAdmin
                    && singleOrder.isPaid && !singleOrder.isDelivered && (
                      <ListGroup.Item>
                        <Button type="button" className="btn btn-block" onClick={deliverOrderHandler}>
                          Mark As Delivered
                        </Button>
                      </ListGroup.Item>
                    )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>

      )}
    </>
  );
};

export default OrderScreen;
