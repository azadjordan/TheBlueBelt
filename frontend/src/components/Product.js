import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <Card className=" my-3  rounded home-product-card"> {/* <-- Added the home-product-card class here */}
      <Link to={`/product/${product._id}`}>
        {/* Show the first image from the images array */}
        <Card.Img src={product.images[0]} variant="top" className="card-img-top" /> {/* Optionally: added the card-img-top class directly here for clarity */}
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`} className="text-decoration-none">

          <Card.Text className="text-truncate" style={{ fontSize: '1.2rem' }}>
            {product.name}
          </Card.Text>

        </Link>

        <Card.Text className="mb-0"><strong>{product.dimensions}</strong> </Card.Text>

        <Card.Text as="h4" style={{ color: 'grey' }}>AED {product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;