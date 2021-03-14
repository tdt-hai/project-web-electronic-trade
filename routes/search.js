const asyncHandler = require('express-async-handler');
const Products = require('../services/product');

const limit = 7;

module.exports = asyncHandler(async (req, res) => {
    const { ajax, q } = req.query;
    let results = null;
    if (ajax) {
        results = await Products.findByName(q, limit);
        const countq = await Products.countByName(q);
        return res.json({ results, q, countq });
    } else {
        results = {
            sanpham: await Products.findByNameAndSanPham(q),
            phukien: await Products.findByNameAndPhuKien(q)
        }
        // hiện tất cả kết quả vào view search.ejs
        return res.render('search', { results, q });
    }
})