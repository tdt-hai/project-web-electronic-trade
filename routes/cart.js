const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const ExtendProducts = require('../services/extend_product');
const Products = require('../services/product');
const Orders = require('../services/orders');
const Extend_Order = require('../services/extend_order');
const Fee_Ship = require('../services/fee_ship');
const db = require('../services/db');

const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
    const cookieCart = req.session.cartAll;
    const fee_ship = await Fee_Ship.findByPk(1);

    let jscartAll = [];
    let totalMoney = 0;
    if (cookieCart) {
        let tempArr = [];
        cookieCart.forEach(e => {
            var filter = Math.trunc(e / 10);
            tempArr.push(filter);
        });

        for (let i = 0; i < cookieCart.length; i++) {
            const found = await ExtendProducts.findByPk(Math.trunc(cookieCart[i] / 10), {
                include: [
                    { model: Products }
                ]
            });

            if (found) {
                totalMoney = totalMoney + (found.product.price * (cookieCart[i] % 10));
                let jsExSame = [];
                const foundExSame = await ExtendProducts.findAll({ where: { productId: found.productId } });

                foundExSame.forEach(e => {
                    if (tempArr.includes(e.id)) {
                        if (e.id === found.id) {
                            let path_image = '/uploads/' + e.path_image;
                            jsExSame.push({ 'exProductId': e.id, 'color': e.color, 'amount': e.amount, 'path_image': path_image });
                        }
                    } else {
                        let path_image = '/uploads/' + e.path_image;
                        jsExSame.push({ 'exProductId': e.id, 'color': e.color, 'amount': e.amount, 'path_image': path_image });
                    }
                });

                jscartAll.push({
                    'exProductId': found.id,
                    'qty': (cookieCart[i] % 10),
                    'productId': found.productId,
                    'productName': found.product.name,
                    'productSame': jsExSame,
                    'productType': found.product.type,
                    'price': found.product.price,
                    'path_url': found.product.path_url,
                    'color': found.color,
                    'amount': found.amount,
                    'path_image': found.path_image
                });
            }
        }
    }

    res.render('cart', { cookieCart, jscartAll, totalMoney, nameCity: fee_ship.nameCity });
}));

router.post('/', asyncHandler(async (req, res) => {
    const ss_cookieCart = req.session.cartAll;
    let cookieCart = req.body.cookieCart;
    const { b_firstname, phone, email, notes, b_address } = req.body.user_data;
    let { selCity, selDistrict, address_cua_hang, check_ship, ip_fee_ship } = req.body;

    if (!ss_cookieCart || !cookieCart) {return res.redirect('/')};

    cookieCart = JSON.parse('[' + cookieCart + ']');
    ip_fee_ship = parseFloat(ip_fee_ship.replace(/\./g, ''));

    const checkFeeShip = await Fee_Ship.findOne({ where: { nameCity: selCity, nameDistrict: selDistrict } });
    let address;
    let isShip = false;

    if (ss_cookieCart.length == cookieCart.length) {
        for (let i = 0; i < ss_cookieCart.length; i++) {
            if (ss_cookieCart[i] != cookieCart[i]) {
                req.session = null;
                return res.render('order_fail', { b_firstname });
            }
        }
        if (check_ship == 1) {
            if (checkFeeShip.fee_ship != ip_fee_ship) {
                req.session = null;
                return res.render('order_fail', { b_firstname });
            }
            isShip = true;
            address = b_address + ', ' + selDistrict + ', ' + selCity;
        }
        if (check_ship == 0) {
            address = address_cua_hang;
        }

        let orderId;
        let totalMoney = 0;
        const t = await db.transaction();
        let jscartAll = [];
        if (cookieCart) {
            const orders = await Orders.addOrder(b_firstname, phone, email, address, notes, isShip, t);
            orderId = orders.id;
            for (let i = 0; i < cookieCart.length; i++) {
                const found = await ExtendProducts.findByPk(Math.trunc(cookieCart[i] / 10), {
                    include: [
                        { model: Products }
                    ]
                });
                if (found) {
                    const qty = cookieCart[i] % 10;
                    if (qty > found.amount || found.amount == 0) {
                        await t.rollback();
                        req.session = null;
                        return res.render('order_fail', { b_firstname });
                    }
                    await Extend_Order.add(orders.id, found.id, qty, found.product.price * qty, t);
                    await ExtendProducts.updateAmount(found.amount - qty, found.id, t);
                    totalMoney = totalMoney + (found.product.price * (cookieCart[i] % 10));

                    jscartAll.push({
                        'exProductId': found.id,
                        'qty': (cookieCart[i] % 10),
                        'productId': found.productId,
                        'productName': found.product.name,
                        'productType': found.product.type,
                        'price': found.product.price,
                        'path_url': found.product.path_url,
                        'color': found.color,
                        'amount': found.amount,
                        'path_image': found.path_image
                    });
                }
            }
            totalMoney += ip_fee_ship;
            await Orders.updateTotalPrice(orders.id, ip_fee_ship, totalMoney, t);
        }
        await t.commit();
        const orderSuccess = await Orders.findByPk(orderId);

        req.session = null;
        res.render('order_success', { orderSuccess, check_ship, jscartAll });
    } else {
        req.session = null;
        return res.render('order_fail', { b_firstname });
    }
}));

router.post('/add', asyncHandler(async (req, res) => {
    let { exProductId, qty, cartAllAmount, cartAll } = req.body;

    cartAll = JSON.parse('[' + cartAll + ']');

    const extendProduct = await ExtendProducts.findByPk(exProductId);
    const product = await Products.findByPk(extendProduct.productId);

    req.session.cartAllAmount = cartAllAmount;
    req.session.cartAll = cartAll;

    res.json({ product, extendProduct, qty });
}));

router.post('/delete', asyncHandler(async (req, res) => {
    const { cartAllAmount, cartAll } = req.body;

    req.session.cartAll = cartAll;
    req.session.cartAllAmount = cartAllAmount;

    res.json({ cartAllAmount });
}));

router.post('/changeColor', asyncHandler(async (req, res) => {
    const cartAll = req.body.cartAll;

    req.session.cartAll = cartAll;

    res.json({ cartAll });
}));

router.post('/changeQty', asyncHandler(async (req, res) => {
    const { cartAllAmount, cartAll } = req.body;

    let totalMoney = 0;
    for (let i = 0; i < cartAll.length; i++) {
        const found = await ExtendProducts.findByPk(Math.trunc(cartAll[i] / 10), {
            include: [
                { model: Products }
            ]
        })
        if (found) {
            totalMoney = totalMoney + (found.product.price * (cartAll[i] % 10));
        }
    }

    req.session.cartAll = cartAll;
    req.session.cartAllAmount = cartAllAmount;

    res.json({ cartAll, cartAllAmount, totalMoney });
}));

router.post('/feeShip', asyncHandler(async (req, res) => {
    const { js_nameCity } = req.body;

    const districtCity = await Fee_Ship.findAll({ where: { nameCity: js_nameCity } });

    res.json({ districtCity });
}));

router.post('/cancelOrders', asyncHandler(async (req, res) => {
    const id = req.body.order_successId;
    let checkSuccess = false;

    const orders = await Orders.findByPk(id, {
        include: [
            { model: Extend_Order }
        ]
    });

    if (!orders.isConfirmed) {
        await orders.cancelOrderByCustomer();

        for (let i = 0; i < orders.extend_orders.length; i++) {
            const ex = await ExtendProducts.findByPk(orders.extend_orders[i].extendProductId);
            await ex.updateQty(orders.extend_orders[i].amount);
        }

        checkSuccess = true;
    }

    res.json({ checkSuccess });
}));

module.exports = router;