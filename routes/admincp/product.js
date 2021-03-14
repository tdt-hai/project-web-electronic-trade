const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const Products = require('../../services/product')
const Utils = require('../../services/utils');

const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    };
    const products = await Products.findAll();
    res.render('admincp/product', { page_name: 'product', products, Utils });
}));

router.get('/changeStatus/:id', asyncHandler(async (req, res) => {
    await Products.updateStatus(req.params.id);
    res.redirect('/admincp/product');
}));

module.exports = router;