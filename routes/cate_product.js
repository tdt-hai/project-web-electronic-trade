const asyncHandler = require('express-async-handler');
const Products = require('../services/product');

const limit_in_page = 20;

const getProduct = asyncHandler(async (req, res) => {
    const type = req.url.split("/")[1].toLowerCase();
    let { filter, sort_by, sort_order, clicked } = req.query;

    let title, numberProducts;
    let _filter, f_price, f_Fprice, f_Tprice, filter_text, f_unit;

    if (type === 'dien-thoai') { title = 'Điện thoại di động' };
    if (type === 'may-tinh-bang') { title = 'Máy tính bảng' };
    if (type === 'smart-watch') { title = 'Đồng hồ thông minh' };
    if (type === 'phu-kien') { title = 'Phụ kiện' };

    let products = await Products.findByCate(0, limit_in_page, type);

    if (products.length > 0) {
        /////////////////// FILTER ///////////////////////
        if (filter) {
            _filter = filter.split('-');
            if (_filter.length == 3) {
                if (_filter[2] == 'trieu') {
                    f_unit = 'triệu';
                    f_price = parseInt(_filter[1] + '000000');
                }
                if (_filter[2] == 'tram') {
                    f_unit = 'trăm';
                    f_price = parseInt(_filter[1] + '00000');
                }

                if (_filter[0] == 'duoi') {
                    filter_text = 'Dưới ' + _filter[1] + ' ' + f_unit;
                    products = await Products.filterCateProductLT(0, limit_in_page, type, f_price);
                    numberProducts = await Products.countCateProductLT(type, f_price);
                }
                if (_filter[0] == 'tren') {
                    filter_text = 'Trên ' + _filter[1] + ' ' + f_unit;
                    products = await Products.filterCateProductGT(0, limit_in_page, type, f_price);
                    numberProducts = await Products.countCateProductGT(type, f_price);
                }
            }
            if (_filter.length == 4) {
                if (_filter[3] == 'trieu') {
                    filter_text = 'Từ ' + _filter[1] + ' - ' + _filter[2] + ' ' + ' triệu';
                    f_Fprice = parseInt(_filter[1] + '000000');
                    f_Tprice = parseInt(_filter[2] + '000000');
                }
                if (_filter[3] == 'tram') {
                    filter_text = 'Từ ' + _filter[1] + ' - ' + _filter[2] + ' ' + ' trăm';
                    f_Fprice = parseInt(_filter[1] + '00000');
                    f_Tprice = parseInt(_filter[2] + '00000');
                }
                products = await Products.filterCateProductFrom(0, limit_in_page, type, f_Fprice, f_Tprice);
                numberProducts = await Products.countCateProductFrom(type, f_Fprice, f_Tprice);
            }
        }

        /////////////////// SORT ///////////////////////
        if (sort_by != null && sort_order != null) {
            if (!filter) {
                if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.sortCateCommon(0, limit_in_page, type);
                if (sort_by == 'price' && sort_order == 'asc') products = await Products.sortCate(0, limit_in_page, type, true, true);
                if (sort_by == 'price' && sort_order == 'desc') products = await Products.sortCate(0, limit_in_page, type, false, true);
            } else {
                if (_filter.length == 3) {
                    if (_filter[0] == 'duoi') {
                        if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.filtersortCateCommonLT(0, limit_in_page, type, f_price);
                        if (sort_by == 'price' && sort_order == 'asc') products = await Products.filtersortCateLT(0, limit_in_page, type, true, true, f_price);
                        if (sort_by == 'price' && sort_order == 'desc') products = await Products.filtersortCateLT(0, limit_in_page, type, false, true, f_price);
                    }
                    if (_filter[0] == 'tren') {
                        if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.filtersortCateCommonGT(0, limit_in_page, type, f_price);
                        if (sort_by == 'price' && sort_order == 'asc') products = await Products.filtersortCateGT(0, limit_in_page, type, true, true, f_price);
                        if (sort_by == 'price' && sort_order == 'desc') products = await Products.filtersortCateGT(0, limit_in_page, type, false, true, f_price);
                    }
                }
                if (_filter.length == 4) {
                    if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.filtersortCateCommonFrom(0, limit_in_page, type, f_Fprice, f_Tprice);
                    if (sort_by == 'price' && sort_order == 'asc') products = await Products.filtersortCateFrom(0, limit_in_page, type, true, true, f_Fprice, f_Tprice);
                    if (sort_by == 'price' && sort_order == 'desc') products = await Products.filtersortCateFrom(0, limit_in_page, type, false, true, f_Fprice, f_Tprice);
                }
            }
        }

        // RENDER
        const amount_in_page = products.length;

        if (!filter) {
            numberProducts = await Products.countProducts(type);
        }
        res.cookie('numberProducts', `${numberProducts}`);

        if (sort_by != null && sort_order != null && clicked)
            return res.json({ products, number_left: parseInt(numberProducts - amount_in_page) });

        return res.render('cate_product', { products, number_left: parseInt(numberProducts - amount_in_page), brand: null, title, type, filter, filter_text, sort_by, sort_order });
    }

    return res.redirect('/');
});

const loadmoreProduct = asyncHandler(async (req, res) => {
    let { page, type, filter, sort_by, sort_order } = req.query;
    const start = (parseInt(page) + 1) * limit_in_page;

    let _filter, f_price, f_Fprice, f_Tprice;

    if (sort_by.length <= 0 || sort_order.length <= 0) {
        sort_by = null;
        sort_order = null;
    }

    const numberProducts = parseInt(req.cookies.numberProducts);
    let products = await Products.findByCate(start, limit_in_page, type);

    /////////////////// FILTER ///////////////////////
    if (filter) {
        _filter = filter.split('-');
        if (_filter.length == 3) {
            if (_filter[2] == 'trieu') {
                f_price = parseInt(_filter[1] + '000000');
            }
            if (_filter[2] == 'tram') {
                f_price = parseInt(_filter[1] + '00000');
            }

            if (_filter[0] == 'duoi') {
                products = await Products.filterCateProductLT(start, limit_in_page, type, f_price);
            }
            if (_filter[0] == 'tren') {
                products = await Products.filterCateProductGT(start, limit_in_page, type, f_price);
            }
        }
        if (_filter.length == 4) {
            if (_filter[3] == 'trieu') {
                f_Fprice = parseInt(_filter[1] + '000000');
                f_Tprice = parseInt(_filter[2] + '000000');
            }
            if (_filter[3] == 'tram') {
                f_Fprice = parseInt(_filter[1] + '00000');
                f_Tprice = parseInt(_filter[2] + '00000');
            }
            products = await Products.filterCateProductFrom(start, limit_in_page, type, f_Fprice, f_Tprice);
        }
    }

    /////////////////// SORT ///////////////////////
    if (sort_by != null && sort_order != null) {
        if (!filter) {
            if (sort_by == 'price' && sort_order == 'asc') products = await Products.sortCate(start, limit_in_page, type, true, true)
            if (sort_by == 'price' && sort_order == 'desc') products = await Products.sortCate(start, limit_in_page, type, false, true)
            if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.sortCateCommon(start, limit_in_page, type)
        } else {
            if (_filter.length == 3) {
                if (_filter[0] == 'duoi') {
                    if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.filtersortCateCommonLT(start, limit_in_page, type, f_price);
                    if (sort_by == 'price' && sort_order == 'asc') products = await Products.filtersortCateLT(start, limit_in_page, type, true, true, f_price);
                    if (sort_by == 'price' && sort_order == 'desc') products = await Products.filtersortCateLT(start, limit_in_page, type, false, true, f_price);
                }
                if (_filter[0] == 'tren') {
                    if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.filtersortCateCommonGT(start, limit_in_page, type, f_price);
                    if (sort_by == 'price' && sort_order == 'asc') products = await Products.filtersortCateGT(start, limit_in_page, type, true, true, f_price);
                    if (sort_by == 'price' && sort_order == 'desc') products = await Products.filtersortCateGT(start, limit_in_page, type, false, true, f_price);
                }
            }
            if (_filter.length == 4) {
                if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.filtersortCateCommonFrom(start, limit_in_page, type, f_Fprice, f_Tprice);
                if (sort_by == 'price' && sort_order == 'asc') products = await Products.filtersortCateFrom(start, limit_in_page, type, true, true, f_Fprice, f_Tprice);
                if (sort_by == 'price' && sort_order == 'desc') products = await Products.filtersortCateFrom(start, limit_in_page, type, false, true, f_Fprice, f_Tprice);
            }
        }
    }

    const amount_in_page = parseInt(start + products.length);

    res.json({ products, number_left: parseInt(numberProducts - amount_in_page) });
});

module.exports = {
    getProduct,
    loadmoreProduct
};