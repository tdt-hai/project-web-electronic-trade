const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const Products = require('../services/product');

const router = new Router();

router.get('/:path', asyncHandler(async (req, res) => {
    const product = await Products.findOneProduct(req.params.path);
    const cookieCart = req.session.cartAll;

    if (product) {
        const type = product.type;
        const title = product.name;

        let titleCate;
        if (type === 'dien-thoai') { titleCate = 'Điện thoại' };
        if (type === 'may-tinh-bang') { titleCate = 'Máy tính bảng' };
        if (type === 'smart-watch') { titleCate = 'Đồng hồ thông minh' };
        if (type === 'phu-kien') { titleCate = 'Phụ kiện' };

        const productGroup = await Products.findProductGroupnotPath(type, product.producer, product.group, req.params.path);
        const products = await Products.findProductSameBrand(req.params.path, type, product.producer, 4);

        let isSameRam = false;
        if (productGroup.length > 1) {
            for (let i = 0; i < productGroup.length; i++) {
                if (productGroup[i].ram == productGroup[i++].ram) {
                    isSameRam = true;
                }
            }
        } else if (productGroup.length == 1) {
            if (productGroup[0].ram == product.ram) {
                isSameRam = true;
            }
        }

        return res.render('product_detail', { product, title, type, titleCate, productGroup, isSameRam, products, cookieCart });
    };
    res.redirect('/');
}));

module.exports = router;