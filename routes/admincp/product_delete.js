const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const Products = require('../../services/product')

const router = new Router();

router.get('/:id', asyncHandler(async function (req, res) {
    if (!req.currentUser || (req.currentUser && req.currentUser.isStaff === false)) {
        return res.redirect('/admincp/login');
    }

    await Products.deleteProduct(req.params.id);
    res.redirect('/admincp/product');
}))

module.exports = router;