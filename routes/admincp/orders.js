const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const Orders = require('../../services/orders');
const Extend_Orders = require('../../services/extend_order');
const Products = require('../../services/product');
const ExtendProducts = require('../../services/extend_product');
const Email = require('../../services/email');
const moment = require('moment');

const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    }

    const orders = await Orders.findAll();
    const orders_success = await Orders.findAll({ where: { status: 1 } });
    const getMonthNow = moment().format('MM');
    
    let countOrdersSuccess = 0;
    for (let i = 0; i < orders_success.length; i++) {
        if (moment(orders_success[i].createdAt).format('MM') == getMonthNow) {
            countOrdersSuccess++;
        }
    }

    res.render('admincp/orders', { orders, countOrdersSuccess, page_name: 'orders' });
}));

router.get('/detail/:id', asyncHandler(async function (req, res) {
    if (!req.currentUser || (req.currentUser && req.currentUser.isStaff === false)) {
        return res.redirect('/admincp/login');
    }

    const order = await Orders.findByPk(req.params.id, {
        include: [
            { model: Extend_Orders, include: [{ model: ExtendProducts, include: [{ model: Products }] }] }
        ]
    });

    if (!order) {
        return res.redirect('/admincp/orders');
    }

    res.render('admincp/orders_detail', { order });
}))

router.post('/detail/:id', asyncHandler(async (req, res) => {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    }

    let { fullName, phone, email, address, info, confirm, cancel, paid } = req.body;
    let status;
    let save = false;

    const order = await Orders.findByPk(req.params.id, {
        include: [
            { model: Extend_Orders }
        ]
    });

    if (order.isDone) {
        return res.redirect('/admincp/orders');
    }

    if (order) {
        save = true;
        await order.saveOrders(fullName, phone, email, address, info);
    }

    if (confirm != null) {
        if (!order) {
            return res.redirect('/admincp/orders?action=confirmOrders&error=1');
        }

        if (order.isShip) {
            status = 3;
            await Email.send(order.customer_email, 'Đơn đặt hàng - AeMobile <no-reply>', `<b>Xác nhận đơn đặt hàng của ${order.customer_name} Thành Công!</b><br>AeMobile đang giao hàng cho đơn vị vận chuyển. Trong vòng <b>15 phút</b> nhân viên giao hàng sẽ báo thời gian giao hàng cụ thể cho quý khách.<br><br>Cảm ơn quý khách!`);
        } else {
            status = 2;
            await Email.send(order.customer_email, 'Đơn đặt hàng - AeMobile <no-reply>', `<b>Xác nhận đơn đặt hàng của ${order.customer_name} Thành Công!</b><br>AeMobile mời quý khách ghé cửa hàng Thanh toán đơn đặt hàng trong vòng 24h.<br><br>Cảm ơn quý khách!`);
        }

        await order.confirm(status);

        return res.redirect('/admincp/orders?action=confirmOrders&error=0');
    }

    if (cancel != null) {
        if (!order) {
            return res.redirect('/admincp/orders?action=cancelOrders&error=1');
        }

        for (let i = 0; i < order.extend_orders.length; i++) {
            const ex = await ExtendProducts.findByPk(order.extend_orders[i].extendProductId);
            await ex.updateQty(order.extend_orders[i].amount);
        }

        await order.cancelOrderByStaff();

        return res.redirect('/admincp/orders?action=cancelOrders&error=0');
    }

    if (paid != null) {
        if (!order) {
            return res.redirect('/admincp/orders?action=paidOrders&error=1');
        }

        await Email.send(order.customer_email, 'Thanh toán Thành công - AeMobile <no-reply>', `<b>Đơn đặt hàng của ${order.customer_name} đã được thanh toán!</b><br>AeMobile cảm ơn quý khách đã tin tưởng mua hàng tại hệ thống của chúng tôi.<br><br>Hẹn gặp lại!`);
        await order.paidOrder();

        return res.redirect('/admincp/orders?action=paidOrders&error=0');
    }

    if (save) {
        return res.redirect('/admincp/orders?action=saveOrders&error=0');
    } else {
        return res.redirect('/admincp/orders?action=saveOrders&error=1');
    }
}));

module.exports = router;