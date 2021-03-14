const asyncHandler = require('express-async-handler');
const Product_Group = require('../../services/product_group');

const loadProductGr = asyncHandler(async (req, res) => {
    const { category, producer } = req.body;
    const productGr = await Product_Group.findProductGr(category, producer);

    res.json({ productGr });
});

module.exports = loadProductGr;