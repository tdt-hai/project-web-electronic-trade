const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const Product_Group = require('../../services/product_group');

const router = new Router();

function handingInputText(string) {
    let hString = string.toLowerCase().split(/(\s+)/).filter(e => e.trim().length > 0);
    let strLow = hString.join(' ');
    let strUp = [];
    for (let i = 0; i < hString.length; i++) {
        if (hString[i].length == 2) {
            strUp.push(hString[i].charAt(0).toUpperCase() + hString[i].charAt(1).toUpperCase());
            continue;
        }
        strUp.push(hString[i].charAt(0).toUpperCase() + hString[i].slice(1));
    }
    strUp = strUp.join(' ');

    return { strLow, strUp };
}

// Show product_group
router.get('/', asyncHandler(async (req, res) => {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    }

    const url = req.protocol + '://' + req.get('host');

    res.render('admincp/productGroup_add', { product_group: null, url, error: null, page_name: 'productGroup_add' });
}));

// Add product_group
router.post('/', asyncHandler(async (req, res) => {
    let { category, producer, productGrName } = req.body;
    let status = req.body["checkbox-isKichhoat"] === "1" ? true : false;
    let error;

    let { strLow, strUp } = handingInputText(productGrName);

    let queryDB = await Product_Group.findProductGroup(category, producer);

    for (let i = 0; i < queryDB.length; i++) {
        if (queryDB[i].groupName.toLowerCase() == strLow) {
            error = 'Tên nhóm sản phẩm đã tồn tại.'
            return res.render('admincp/productGroup_add', { product_group: null, error });
        }
    }
    await Product_Group.add(strUp, category, producer, status);

    res.redirect('/admincp/productGroup');
}));

// Get one product_group
router.get('/:id', asyncHandler(async (req, res) => {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    }

    const product_group = await Product_Group.findProductById(req.params.id);

    if (!product_group) {
        return res.redirect('/admincp/productGroup');
    }

    const url = req.protocol + '://' + req.get('host');

    res.render('admincp/productGroup_add', { url, product_group, error: null });
}));

// Update one product_group
router.post('/:id', asyncHandler(async (req, res) => {
    let { category, producer, productGrName } = req.body;
    let status = req.body["checkbox-isKichhoat"] === "1" ? true : false;

    let { strLow, strUp } = handingInputText(productGrName);


    let queryDB = await Product_Group.findProductGroup(category, producer);

    for (let i = 0; i < queryDB.length; i++) {
        if (queryDB[i].groupName.toLowerCase() == strLow) {
            return res.redirect('/admincp/productGroup/add/' + req.params.id + '?action=error');
        }
    }

    // Update Product
    await Product_Group.updateProduct(req.params.id, strUp, category, producer, status);

    res.redirect('/admincp/productGroup');
}));

module.exports = router;