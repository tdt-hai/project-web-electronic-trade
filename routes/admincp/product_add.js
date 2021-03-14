const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const upload = require('../../middlewares/upload');
const Products = require('../../services/product');
const Product_Group = require('../../services/product_group');
const Extend_Product = require('../../services/extend_product');
const Utils = require('../../services/utils');

const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    }

    const url = req.protocol + '://' + req.get('host');

    res.render('admincp/product_add', { product: null, extend_products: null, product_group: null, url, page_name: 'product_add' });
}));

router.get('/:id', asyncHandler(async (req, res) => {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    }

    const product = await Products.findProductById(req.params.id);

    if (!product) {
        return res.redirect('/admincp/login');
    }

    const extend_products = await Extend_Product.findExtendProductById(req.params.id);
    const product_group = await Product_Group.findByPk(product.group);
    const url = req.protocol + '://' + req.get('host');

    res.render("admincp/product_add", { product, extend_products, url, product_group });
}));

router.post('/', upload.any(), asyncHandler(async (req, res) => {
    let { category, producer, productName, productScreen, frontCamera, rearCamera, OS,
        CPU, RAM, storage, Sim, batteryCapacity, released, ckeditor, total_tloc, productGroup,
        productPrice, path_url, conversation, network_connection, productScreenSW, screen_size, 
        battery_life_time, OS_SW, connect_os, face_material, face_diameter, connect, language, health_monitor, 
        functionP, output, tech_util, wire_length, trademark, made_in } = req.body;

    productPrice = productPrice.replace(/\./g, '');
    let hangcty = req.body["checkbox-hangcty"] === "1" ? true : false;
    let tg = req.body["radio-tg_sgg"] === "tra-gop" ? true : false;
    let sgg = req.body["radio-tg_sgg"] === "sieu-giam-gia" ? true : false;
    let noi_bat = req.body["checkbox-noibat"] === "1" ? true : false;
    let kich_hoat = req.body["checkbox-isKichhoat"] === "1" ? true : false;

    // Add new product
    const product = await Products.add(
        category, producer, productGroup, productName, productPrice,
        productScreen, OS, rearCamera, frontCamera, CPU, RAM, storage,
        Sim, batteryCapacity, released, path_url, ckeditor, conversation, network_connection, productScreenSW, 
        screen_size, battery_life_time, OS_SW, connect_os, face_material, face_diameter, connect, language, 
        health_monitor, functionP, output, tech_util, wire_length, trademark, made_in, hangcty, tg,
        sgg, noi_bat, kich_hoat);

    // Add Extend_Product
    for (let i = 1; i <= total_tloc; i++) {
        const color = req.body["productColor_" + i];
        const qty = req.body["productQty_" + i];
        const path_image = Utils.updatePath(path_url, product.id) + "-" + color + "-" + product.id + ".jpg"
        j = i - 1;
        const dest = req.files[j].destination;
        await fs.renameSync(dest + "/" + req.files[j].filename, dest + "/" + path_image);
        await Extend_Product.add(product.id, color, qty, path_image);
    };

    res.redirect("/admincp/product");
}));

router.post('/:id', upload.any(), asyncHandler(async (req, res) => {
    let { category, producer, productName, productScreen, frontCamera, rearCamera, OS,
        CPU, RAM, storage, Sim, batteryCapacity, released, ckeditor, total_tloc, productGroup,
        productPrice, path_url, conversation, network_connection, productScreenSW, screen_size, 
        battery_life_time, OS_SW, connect_os, face_material, face_diameter, connect, language, health_monitor, 
        functionP, output, tech_util, wire_length, trademark, made_in } = req.body;

    productPrice = productPrice.replace(/\./g, '');
    let hangcty = req.body["checkbox-hangcty"] === "1" ? true : false;
    let tg = req.body["radio-tg_sgg"] === "tra-gop" ? true : false;
    let sgg = req.body["radio-tg_sgg"] === "sieu-giam-gia" ? true : false;
    let noi_bat = req.body["checkbox-noibat"] === "1" ? true : false;
    let kich_hoat = req.body["checkbox-isKichhoat"] === "1" ? true : false;

    // Update Product
    await Products.updateProduct(req.params.id, category, producer, productGroup, productName, productPrice,
        productScreen, OS, rearCamera, frontCamera, CPU, RAM, storage,
        Sim, batteryCapacity, released, path_url, ckeditor, conversation, network_connection, productScreenSW, 
        screen_size, battery_life_time, OS_SW, connect_os, face_material, face_diameter, connect, language, 
        health_monitor, functionP, output, tech_util, wire_length, trademark, made_in, hangcty, tg,
        sgg, noi_bat, kich_hoat);

    // Handling Extend_Product
    let e_products = await Extend_Product.findExtendProductById(req.params.id);
    if (e_products.length > total_tloc) {
        const last_eProducts = await Extend_Product.findOne({
            limit: 1,
            where: { productId: req.params.id }, order: [['id', 'DESC']]
        });
        await Extend_Product.deleteLastRow(last_eProducts.id);
        e_products = await Extend_Product.findExtendProductById(req.params.id);
    };
    if (e_products.length < total_tloc) {
        await Extend_Product.add(e_products[0].productId, 'temp', 0, 'temp');
        e_products = await Extend_Product.findExtendProductById(req.params.id);
    };

    let path_image;
    for (let i = e_products.length - 1; i >= 0; i--) {
        path_image = Utils.updatePath(productName, e_products[0].productId) + "-" + req.body["productColor_" + total_tloc] + "-" + e_products[0].productId + ".jpg";
        if (req.files.length != 0) {
            if (req.files.length <= 1) {
                if (req.files[0].fieldname === ("productImg_" + total_tloc)) {
                    const dest = req.files[0].destination;
                    await fs.renameSync(dest + "/" + req.files[0].filename, dest + "/" + path_image);
                } else {
                    path_image = e_products[i].path_image;
                };
            } else {
                const dest = req.files[i].destination;
                await fs.renameSync(dest + "/" + req.files[i].filename, dest + "/" + path_image);
            };
        } else {
            path_image = e_products[i].path_image;
        };

        await Extend_Product.updateExtendProduct(e_products[i].id, req.body["productColor_" + total_tloc],
            req.body["productQty_" + total_tloc], path_image);
        total_tloc--;
    };

    res.redirect("/admincp/product");
}));

module.exports = router;