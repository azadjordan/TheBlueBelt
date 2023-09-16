import { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { register } from "../slices/authSlice"; // Make sure to implement this in your authSlice
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorFields, setErrorFields] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    let errors = {};

    if (!name) errors.name = true;
    if (!email) errors.email = true;
    if (!password) errors.password = true;
    if (!confirmPassword) errors.confirmPassword = true;

    setErrorFields(errors);

    if (Object.keys(errors).length) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      errors.password = true;
      errors.confirmPassword = true;
      toast.error("Passwords do not match");
      
      return;
    }

    try {
      await dispatch(register({ name, email, password })).unwrap();
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "An error occurred");
    }
  };

  const inputStyle = (field) => {
    return errorFields[field] ? { borderColor: "red" } : {};
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            style={inputStyle("name")}
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            style={inputStyle("email")}
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            style={inputStyle("password")}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Control
            style={inputStyle("confirmPassword")}
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={status === "loading"}
        >
          Register
        </Button>
        {status === "loading" && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Already have an account? <Link to="/login">Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
