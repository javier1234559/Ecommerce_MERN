import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Rating from "./Rating";
import { LinkContainer } from "react-router-bootstrap";

function CardProduct({ product }) {
  return (
    <Card className="my-3 p-3 rounded" style={{ marginLeft: "0.5rem" }}>
      <LinkContainer to={`/product/${product?._id}`}>
        <Card.Img variant="top" src={product?.image} />
      </LinkContainer>
      <Card.Body>
        <LinkContainer to={`/product/${product?._id}`}>
          <Card.Title as="div">
            <strong>{product?.name}</strong>
          </Card.Title>
        </LinkContainer>
        <Card.Text as="div">
          <div className="my-3">
            <Rating
              color={"#f3969a"}
              value={product?.rating}
              text={`reviews from ${product?.numReviews} user`}
            />
          </div>
        </Card.Text>
        <Card.Text as="h3">{product?.price}</Card.Text>
        <LinkContainer to={`/product/${product?._id}`}>
          <Button variant="primary">Buy</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}

export default CardProduct;
