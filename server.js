const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('./services/db');
const port = process.env.PORT || 3000;

// Session
app.use(cookieSession({
    name: 'session',
    keys: ['nmcnpm-2020'],
    maxAge: 24 * 60 * 60 * 1000 * 30 // 1 month
}));

const { getProduct, loadmoreProduct } = require('./routes/cate_product');
const { getBrand, loadMore } = require('./routes/cate_product_brand');

app.use(express.static(__dirname + '/publics'));
app.use(express.static(__dirname + '/uploads'));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cookieParser('20hcb1-g06'));

// Middlewares
app.use(require('./middlewares/auth'));

// Routes
app.get('/', require('./routes/index'));
app.get('/tim-kiem', require('./routes/search'));
app.use('/cart', require('./routes/cart'));
app.get('/dien-thoai', getProduct);
app.get('/may-tinh-bang', getProduct);
app.get('/smart-watch', getProduct);
app.get('/phu-kien', getProduct);
app.get('/load-more-product', loadmoreProduct);
app.get('/dien-thoai-*', getBrand);
app.get('/may-tinh-bang-*', getBrand);
app.get('/smart-watch-*', getBrand);
app.get('/phu-kien-*', getBrand);
app.get('/load-more-product-brand', loadMore);
app.use('/dien-thoai/', require('./routes/product_detail'));
app.use('/may-tinh-bang/', require('./routes/product_detail'));
app.use('/smart-watch/', require('./routes/product_detail'));
app.use('/phu-kien/', require('./routes/product_detail'));

app.get('/admincp', require('./routes/admincp/index'));
app.use('/admincp/login', require('./routes/admincp/login'));
app.use('/admincp/logout', require('./routes/admincp/logout'));
app.use('/admincp/user', require('./routes/admincp/user'));
app.use('/admincp/user/forgotpassword', require('./routes/admincp/user_forgotPassword'));
app.use('/admincp/product', require('./routes/admincp/product'));
app.post('/admincp/product/add/load-productGr', require('./routes/admincp/productGroup_load'));
app.use('/admincp/product/add', require('./routes/admincp/product_add'));
app.use('/admincp/product/delete', require('./routes/admincp/product_delete'));
app.use('/admincp/productGroup', require('./routes/admincp/productGroup'));
app.use('/admincp/productGroup/add', require('./routes/admincp/productGroup_add'));
app.use('/admincp/productGroup/delete', require('./routes/admincp/productGroup_delete'));
app.use('/admincp/orders', require('./routes/admincp/orders'));
app.use('/admincp/productQuantity', require('./routes/admincp/productQuantity'));
app.use((_, res) => { res.status(404).render('404'); });

db.sync()
    .then(() => {
        app.listen(port, () => console.log(`Server is listening on port ${port}!`));
    })
    .catch(err => console.error(err));