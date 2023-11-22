import express from 'express';
import products from './data/products.js';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 9000;

const app = express();

app.get('/', (req, res) => {
    res.send("API is running");
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    let product = products.find((p) => p.name === req.params.id)
    res.json(product);
});

app.listen(port, () => console.log(`Server running on port ${port}`))