import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Product from '../components/Product';
import axios from 'axios';

const HomeScreen = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products');
      setProducts(data);
      console.log(data);
    };

    fetchProducts();
  }, [])

  return (
    <>
        <h1></h1>
        <Row>
            {products.map((product) => (
                <Col key={product.name} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product}/>
                </Col>
            ))}
        </Row>
    </>
  )
}

export default HomeScreen