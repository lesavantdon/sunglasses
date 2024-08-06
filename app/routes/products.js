const express = require('express');
const router = express.Router();
const products = require('@/initial-data/products.json');

// Search for glasses
router.get('/search', (req, res) => {
  const query = req.query.query;
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  res.json(filteredProducts);
});

module.exports = router;
