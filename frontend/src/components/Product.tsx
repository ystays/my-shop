import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import Rating from './Rating';

const Product = ({ product }: {product: { name: string,
    image: string, description: string, brand: string, category: string, price: number, countInStock: number, rating: number, numReviews: number, }} ) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <a href={`/product/${product.name}`}>
        <Card.Img src={product.image} variant='top' />
      </a>

      <Card.Body>
        <a href={`/product/${product.name}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </a>

        {/* <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text> */}

        <Card.Text as='h3'>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;