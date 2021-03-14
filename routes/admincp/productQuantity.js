const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    }


    res.render('admincp/productQuantity', { page_name: 'productQuantity' });
}));

module.exports = router;