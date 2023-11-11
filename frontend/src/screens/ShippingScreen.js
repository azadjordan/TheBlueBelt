import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice.js";
import CheckoutSteps from "../components/CheckoutSteps";


const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [emirate, setEmirate] = useState(shippingAddress?.emirate || '');
  const [city, setCity] = useState(shippingAddress?.city || '');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, emirate, city }));
    navigate("/payment");
  };

  return (
    <>
      <FormContainer>
      <CheckoutSteps step1 step2 />
        <h1>Shipping</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="address" className="my-2">
            <Form.Label>Full Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Full Address ex:(AbuDhabi, Alain, street77, Building 5)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="emirate" className="my-2">
            <Form.Label>Emirate</Form.Label>
            <Form.Control
              type="text"
              placeholder="Emirate ex:(Dubai)"
              value={emirate}
              onChange={(e) => setEmirate(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="city" className="my-2">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="City ex:(Alain)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>



          <Button type="submit" variant="primary" className="my-2">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
