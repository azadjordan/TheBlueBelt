import { Container, Row, Col } from "react-bootstrap";
import { FaWhatsapp } from 'react-icons/fa';
// import ReactCountryFlag from "react-country-flag";



const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <Container>
        <Row className="py-4">
          <Col className=" py-3">

            <h5>Click to WhatsApp <FaWhatsapp style={{ color: '#10BC10', fontSize: '1.5rem' }} />   </h5>

            <Row>
              <Col>
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
                  className="text-decoration-none "
                  style={{ fontSize: '1.2rem' }}
                >
                  0545050244
                </a>
              </Col>
            </Row>

          </Col>
          <Col sm={5} xs={5} md={5} className="d-flex align-items-center justify-content-center py-3">
            <p style={{ fontSize: '2rem' }}>
              <strong>TheBlueBelt</strong>&copy;{currentYear}
            </p>
          </Col>

          <Col sm={1} xs={1} md={2} lg={3} xl={4} className="d-flex align-items-center justify-content-center py-3">

{/* 
            <p>Operating in UAE <ReactCountryFlag style={{fontSize:'1.3rem'}} countryCode="AE" svg />
</p> */}

          </Col>

        </Row>
      </Container>
    </footer>
  );
};
export default Footer;
