const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getDashboardStats,
  getUniqueBrands,
  getUniqueSizes
} = require('../controllers/productController');

// Stats and metadata routes first to prevent conflicts with /:id
router.get('/stats', getDashboardStats);
router.get('/brands', getUniqueBrands);
router.get('/sizes', getUniqueSizes);
router.get('/search', getProducts);
router.get('/filter', getProducts);

// Core CRUD routes
router.route('/')
  .post(createProduct)
  .get(getProducts);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
