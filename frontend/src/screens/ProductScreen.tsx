import { useParams } from "react-router-dom"
import products from "../products";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";

const ProductScreen = () => {
    const { id: productId } = useParams();
    let product: any = products.find((p) => p.name === productId);
    
  return (
    <>
    <Link className="btn btn-light my-3" to='/'>
        Go Back
    </Link>
    <Row>
        <Col md={5}>
            <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={4}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            </ListGroup>
        </Col>
        <Col md={3}>

        </Col>
    </Row>
    </>
    )
}

export default ProductScreen