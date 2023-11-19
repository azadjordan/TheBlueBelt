import { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { login } from "../slices/authSlice.js"; 
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorFields, setErrorFields] = useState({}); // State for error fields

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    let errors = {};

    if (!email) errors.email = true;
    if (!password) errors.password = true;

    setErrorFields(errors);

    if (Object.keys(errors).length) {
      toast.error("Email and Password are required.");
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate(redirect);
    } catch (err) {
      toast.error(err?.message || 'An error occurred');
    }
  };

  return (

    <FormContainer  >
      <h1 className='mt-5'>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            style={errorFields.email ? { borderColor: 'red' } : {}}
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            style={errorFields.password ? { borderColor: 'red' } : {}}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={status === "loading"}
        >
          Sign In
        </Button>
        {status === "loading" && <Loader />}
      </Form>
      
      <Row className="py-3">
        <Col>
          New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
