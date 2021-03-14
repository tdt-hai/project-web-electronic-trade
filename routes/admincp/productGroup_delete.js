const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const Products_Group = require('../../services/product_group')
const router = new Router();

router.get('/:id', asyncHandler(async function (req, res) {
    if (!req.currentUser || (req.currentUser && req.currentUser.isStaff === false)) {
        return res.redirect('/admincp/login');
    }

    await Products_Group.deleteProduct(req.params.id);
    res.redirect('/admincp/productGroup');
}))

module.exports = router;