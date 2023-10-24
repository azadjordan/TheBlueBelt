import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded home-product-card"> {/* <-- Added the home-product-card class here */}
      <Link to={`/product/${product._id}`}>
        {/* Show the first image from the images array */}
        <Card.Img src={product.images[0]} variant="top" className="card-img-top" /> {/* Optionally: added the card-img-top class directly here for clarity */}
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="h3">AED {product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
