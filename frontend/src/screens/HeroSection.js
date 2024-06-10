import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const HeroSection = () => {
  return (
    <div className="bg-light p-5 rounded-lg m-3">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={8}>
            <h1>Welcome to Prime Materials</h1>
            <p>Your trusted partner in supplying high-quality raw materials for all your printing needs. Enhance your printing services with our top-grade materials today.</p>
            <Button variant="primary" href="#contact">Get in Touch</Button>
          </Col>
          <Col xs={12} md={4}>
            {/* Image or illustration related to raw materials for printing could be placed here */}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
