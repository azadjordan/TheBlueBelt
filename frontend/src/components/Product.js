import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <Card className="my-2 rounded home-product-card">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.images[0]} variant="top" className="card-img-top" />
      </Link>

      <Card.Body className="card-body-home-screen">
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <Card.Text className="text-truncate" style={{ fontSize: '1.2rem' }}>
            {product.name}
          </Card.Text>
        </Link>

        <Card.Text className="mb-0"><strong>{product.dimensions}</strong></Card.Text>

        {/* Conditionally render the stock status with color coding */}
        <Card.Text className="pb-0 mb-0 price-stock-container" style={product.countInStock === 0 ? { color: 'red' } : { color: 'green' }}>

          <span className="product-price-tag"> AED {product.price} </span>
          <span className="in-stock-tag">{product.countInStock === 0 ? "Out of Stock" : "In Stock"}</span> 

        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
