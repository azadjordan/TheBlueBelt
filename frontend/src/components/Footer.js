import { Container, Row, Col } from "react-bootstrap";
import { FaWhatsapp } from 'react-icons/fa';
// import ReactCountryFlag from "react-country-flag";



const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="pt-3 pb-2">
              <Container fluid className="h-100"> 
            <Row className="justify-content-center align-items-center h-100"> 
                {/* WhatsApp Info Column */}
                <Col xs={12} md={6}  className="text-center"> 
                    <h5>Click for WhatsApp <FaWhatsapp style={{ color: '#10BC10', fontSize: '1.5rem' }} /></h5>
                    <a
                        href="https://wa.me/971549922295?text=Hello!%20I%20would%20like%20to%20talk%20to%20TheBlueBelt's%20customer%20service%20please.."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                        style={{ fontSize: '1.2rem' }}
                    >
                        0549922295
                    </a>
                    <span> / </span>
                    <a
                        href="https://wa.me/971545050244?text=Hello!%20I%20would%20like%20to%20talk%20to%20TheBlueBelt's%20customer%20service%20please.."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                        style={{ fontSize: '1.2rem' }}
                    >
                        0545050244
                    </a>
                </Col>

                {/* Copyright Info Column */}
                <Col xs={12} md={6} className="text-center pt-2"> 
                    <p style={{ fontSize: '1.6rem' }}>
                        <strong>TheBlueBelt</strong> &copy; {currentYear}
                    </p>
                </Col>
            </Row>
        </Container>
    </footer>
  );
};
export default Footer;
