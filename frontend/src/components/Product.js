import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <Card className="my-3 rounded home-product-card">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.images[0]} variant="top" className="card-img-top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <Card.Text className="text-truncate" style={{ fontSize: '1.2rem' }}>
            {product.name}
          </Card.Text>
        </Link>

        <Card.Text className="mb-0"><strong>{product.dimensions}</strong></Card.Text>

        {/* Conditionally render the stock status with color coding */}
        <Card.Text className="pb-0 mb-0" style={product.countInStock === 0 ? { color: 'red' } : { color: 'green' }}>
<strong>          {product.countInStock === 0 ? "Out of Stock" : "In Stock"}
</strong>
        </Card.Text>

        <Card.Text className="pt-0 mt-0" as="h5" style={{ color: 'grey' }}>
          AED {product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
