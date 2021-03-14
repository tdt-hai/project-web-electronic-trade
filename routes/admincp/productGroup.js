const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const Products_group = require('../../services/product_group')
const Utils = require('../../services/utils');

const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    };
    const products_group = await Products_group.findAll();
    res.render('admincp/productGroup', { page_name: 'productGroup', products_group, Utils });
}));

router.get('/changeStatus/:id', asyncHandler(async (req, res) => {
    await Products_group.updateStatus(req.params.id);
    res.redirect('/admincp/productGroup');
}));

module.exports = router;