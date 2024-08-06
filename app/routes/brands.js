const express = require('express');
const router = express.Router();
const brands = require('@/initial-data/brands.json');
const products = require('@/initial-data/products.json');

// Get all brands
router.get('/', (req, res) => {
  res.json(brands);
});

// Get products by brand
router.get('/:brand', (req, res) => {
  const brandName = req.params.brand.toLowerCase();
  const brand = brands.find(b => b.name.toLowerCase() === brandName);

  if (!brand) {
    return res.status(404).json({ message: 'Brand not found' });
  }

  const filteredProducts = products.filter(p => p.categoryId === brand.id);
  res.json(filteredProducts);
});

module.exports = router;
