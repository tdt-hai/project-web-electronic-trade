const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const Products = require('../services/product');

const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
    const procducer = ['Iphone', 'Samsung', 'Ipad'];
    let product_iphone = await Products.findAllProductByProducer(procducer[0], 'dien-thoai');
    let product_samsung = await Products.findAllProductByProducer(procducer[1], 'dien-thoai');
    let product_maytinhbang = await Products.findAllProductByTablet('may-tinh-bang');
    let product_phukien = await Products.findAllProductByType('phu-kien');
    let product_smartwatch = await Products.findAllProductByType('smart-watch');
    let product_noibat = await Products.findAllProductByHighlights('dien-thoai');
    
    res.render('index', { product_iphone, product_samsung, product_maytinhbang, product_smartwatch, product_phukien, product_noibat });
}));

module.exports = router;
