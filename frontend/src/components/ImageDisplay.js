import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import '../assets/styles/Gallery.css'; // Make sure to include the CSS file for styling

const ImageDisplay = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
      const fetchImages = async () => {
        try {
          const response = await axios.get('/api/images');
          setImages(response.data);
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      };
  
      fetchImages();
    }, []);
  
    return (
        <Container>
          <Row>
            {images.map((image, index) => (
              <Col md={2} key={index} className="mb-3">
                <div className="image-card">
                  <div className="image-card-inner">
                    <div className="image-card-front">
                      <img src={image.imageUrl} alt={`Tags: ${image.tags.join(', ')}`} className="img-fluid" />
                    </div>
                    <div className="image-card-back">
                      <p>{image.tags.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
    );
};

export default ImageDisplay;
