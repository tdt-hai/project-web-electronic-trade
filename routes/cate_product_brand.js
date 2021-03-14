const asyncHandler = require('express-async-handler');
const Products = require('../services/product');

const limit_in_page = 20;

const getBrand = asyncHandler(async (req, res) => {
    const brand = req.params[0].replace('/', '').toLowerCase();
    const type = req.url.split("/")[1].toLowerCase().substr(0, req.url.split("/")[1].lastIndexOf("-"));
    let { filter, sort_by, sort_order, clicked } = req.query;

    let title, numberProducts;
    let _filter, f_price, f_Fprice, f_Tprice, filter_text, f_unit;

    if (type === 'dien-thoai') { title = 'Điện thoại' };
    if (type === 'may-tinh-bang') { title = 'Máy tính bảng' };
    if (type === 'smart-watch') { title = 'Đồng hồ thông minh' };
    if (type === 'phu-kien') { title = 'Phụ kiện' };

    let products = await Products.findByBrand(brand, 0, limit_in_page, type);

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
                    products = await Products.filterCateProductBrandLT(0, limit_in_page, type, f_price, brand);
                    numberProducts = await Products.countCateProductBrandLT(type, f_price, brand);
                }
                if (_filter[0] == 'tren') {
                    filter_text = 'Trên ' + _filter[1] + ' ' + f_unit;
                    products = await Products.filterCateProductBrandGT(0, limit_in_page, type, f_price, brand);
                    numberProducts = await Products.countCateProductBrandGT(type, f_price, brand);
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
                products = await Products.filterCateProductBrandFrom(0, limit_in_page, type, f_Fprice, f_Tprice, brand);
                numberProducts = await Products.countCateProductBrandFrom(type, f_Fprice, f_Tprice, brand);
            }
        }

        ////////////////////// SORT ///////////////////
        if (sort_by != null && sort_order != null) {
            if (!filter) {
                if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.sortCateCommonByBrand(0, limit_in_page, type, brand);
                if (sort_by == 'price' && sort_order == 'asc') products = await Products.sortCateByBrand(0, limit_in_page, type, true, true, brand);
                if (sort_by == 'price' && sort_order == 'desc') products = await Products.sortCateByBrand(0, limit_in_page, type, false, true, brand);
            } else {
                if (_filter.length == 3) {
                    if (_filter[0] == 'duoi') {
                        if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.filtersortCateBrandCommonLT(0, limit_in_page, type, f_price, brand);
                        if (sort_by == 'price' && sort_order == 'asc') products = await Products.filtersortCateBrandLT(0, limit_in_page, type, true, true, f_price, brand);
                        if (sort_by == 'price' && sort_order == 'desc') products = await Products.filtersortCateBrandLT(0, limit_in_page, type, false, true, f_price, brand);
                    }
                    if (_filter[0] == 'tren') {
                        if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.filtersortCateBrandCommonGT(0, limit_in_page, type, f_price, brand);
                        if (sort_by == 'price' && sort_order == 'asc') products = await Products.filtersortCateBrandGT(0, limit_in_page, type, true, true, f_price, brand);
                        if (sort_by == 'price' && sort_order == 'desc') products = await Products.filtersortCateBrandGT(0, limit_in_page, type, false, true, f_price, brand);
                    }
                }
                if (_filter.length == 4) {
                    if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.filtersortCateBrandCommonFrom(0, limit_in_page, type, f_Fprice, f_Tprice, brand);
                    if (sort_by == 'price' && sort_order == 'asc') products = await Products.filtersortCateBrandFrom(0, limit_in_page, type, true, true, f_Fprice, f_Tprice, brand);
                    if (sort_by == 'price' && sort_order == 'desc') products = await Products.filtersortCateBrandFrom(0, limit_in_page, type, false, true, f_Fprice, f_Tprice, brand);
                }
            }
        }

        // RENDER
        const amount_in_page = products.length;

        if (!filter) {
            numberProducts = await Products.countProductsByBrand(type, brand)
        }
        res.cookie('numberProducts', `${numberProducts}`);

        if (sort_by != null && sort_order != null && clicked)
            return res.json({ products, number_left: parseInt(numberProducts - amount_in_page) });

        return res.render('product_brand', { products, brand, number_left: parseInt(numberProducts - amount_in_page), title, type, filter, filter_text, sort_by, sort_order });
    }

    return res.redirect('/');
});

const loadMore = asyncHandler(async (req, res) => {
    let { type, brand, page, filter, sort_by, sort_order } = req.query;
    const start = (parseInt(page) + 1) * limit_in_page;

    let _filter, f_price, f_Fprice, f_Tprice;

    if (sort_by.length <= 0 || sort_order.length <= 0) {
        sort_by = null;
        sort_order = null;
    }

    const numberProducts = parseInt(req.cookies.numberProducts);
    let products = await Products.findByBrand(brand, start, limit_in_page, type);

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
                products = await Products.filterCateProductBrandLT(start, limit_in_page, type, f_price, brand);
            }
            if (_filter[0] == 'tren') {
                filter_text = 'Trên ' + _filter[1] + ' ' + f_unit;
                products = await Products.filterCateProductBrandGT(start, limit_in_page, type, f_price, brand);
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
            products = await Products.filterCateProductBrandFrom(start, limit_in_page, type, f_Fprice, f_Tprice, brand);
        }
    }

    ////////////////////// SORT ///////////////////
    if (sort_by != null && sort_order != null) {
        if (!filter) {
            if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.sortCateCommonByBrand(start, limit_in_page, type, brand);
            if (sort_by == 'price' && sort_order == 'asc') products = await Products.sortCateByBrand(start, limit_in_page, type, true, true, brand);
            if (sort_by == 'price' && sort_order == 'desc') products = await Products.sortCateByBrand(start, limit_in_page, type, false, true, brand);
        } else {
            if (_filter.length == 3) {
                if (_filter[0] == 'duoi') {
                    if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.filtersortCateBrandCommonLT(start, limit_in_page, type, f_price, brand);
                    if (sort_by == 'price' && sort_order == 'asc') products = await Products.filtersortCateBrandLT(start, limit_in_page, type, true, true, f_price, brand);
                    if (sort_by == 'price' && sort_order == 'desc') products = await Products.filtersortCateBrandLT(start, limit_in_page, type, false, true, f_price, brand);
                }
                if (_filter[0] == 'tren') {
                    if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.filtersortCateBrandCommonGT(start, limit_in_page, type, f_price, brand);
                    if (sort_by == 'price' && sort_order == 'asc') products = await Products.filtersortCateBrandGT(start, limit_in_page, type, true, true, f_price, brand);
                    if (sort_by == 'price' && sort_order == 'desc') products = await Products.filtersortCateBrandGT(start, limit_in_page, type, false, true, f_price, brand);
                }
            }
            if (_filter.length == 4) {
                if (sort_by == 'popularity' && sort_order == 'desc') products = await Products.filtersortCateBrandCommonFrom(start, limit_in_page, type, f_Fprice, f_Tprice, brand);
                if (sort_by == 'price' && sort_order == 'asc') products = await Products.filtersortCateBrandFrom(start, limit_in_page, type, true, true, f_Fprice, f_Tprice, brand);
                if (sort_by == 'price' && sort_order == 'desc') products = await Products.filtersortCateBrandFrom(start, limit_in_page, type, false, true, f_Fprice, f_Tprice, brand);
            }
        }
    }

    const amount_in_page = start + products.length;

    res.json({ products, number_left: parseInt(numberProducts - amount_in_page) });
});

module.exports = {
    getBrand,
    loadMore
};