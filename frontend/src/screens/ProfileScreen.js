import { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { updateProfile } from "../slices/authSlice.js";
import { fetchMyOrders } from "../slices/orderSlice";
import {FaTimes} from 'react-icons/fa'
import { Link } from "react-router-dom";


const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // 1. Add state for phone number

  const dispatch = useDispatch();

  const {
    userInfo,
    status: authStatus,
    error,
  } = useSelector((state) => state.auth);

// This useEffect is for setting state from userInfo
useEffect(() => {
  if (userInfo) {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setPhoneNumber(userInfo.phoneNumber || ""); 
  }
}, [userInfo]);

// This useEffect is for fetching orders and will only run once (when the component mounts)
useEffect(() => {
  dispatch(fetchMyOrders());
}, [dispatch]);


  const {orders, orderStatus: ordersStatus, orderError: ordersError} = useSelector((state)=> state.order)

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        updateProfile({ _id: userInfo._id, name, email, password, phoneNumber })
      ).unwrap();
      toast.success("Profile Updated");
    } catch (err) {
      toast.error(err?.message || "An unknown error occurred");
    }
  };

  return (

    <Row>
    {authStatus === "loading" ? (<Loader/>) : error ? (
           <Message variant='danger'>
         {error?.data?.message || error?.error} 
         </Message>
         ) : (
      <Col md={3}>
        <h2>User Profile</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="phoneNumber" className="my-2">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></Form.Control>
        </Form.Group>

          <Form.Group controlId="email" className="my-2">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password" className="my-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="my-2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-2">
            Update
          </Button>
          {authStatus === "loading" && <Loader />}
        </Form>
      </Col>
    )}
      
      <Col md={9}>
        <h2>My Orders</h2>
        {ordersStatus === 'loading' ? (

        <Loader/>
        ) : ordersError ? (
           <Message variant='danger'>
         {ordersError?.data?.message || ordersError?.error || ordersError} 
         </Message>
         ) : ordersStatus === 'succeeded' && orders && (
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>Delivered</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((x)=>(
                <tr key={x._id}>
                  <td> {x._id} </td>
                  <td> {x.createdAt.substring(0,10)} </td>
                  <td> {x.totalPrice} </td>
                  <td>
                    {x.isPaid ? (
                      x.paidAt.substring(0,10)
                    ) : (
                      <FaTimes style={{color: 'red'}}/>
                    )}
                  </td>
                  <td>
                    {x.isDelivered ? (
                      x.deliveredAt.substring(0,10)
                    ) : (
                      <FaTimes style={{color: 'red'}}/>
                    )}
                  </td>
                  <td>
                    <Button as={Link} to={`/order/${x._id}`} className="btn-sm" variant="light">
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
         ) 
        }
      </Col>

    </Row>
  );
};

export default ProfileScreen;
