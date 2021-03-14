const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../../services/user');

const router = new Router();

router.get('/', (req, res) => {
    if (req.currentUser) {
        return res.redirect('/admincp');
    }
    res.render('admincp/login', { error: null, page_name: 'login' });
});

router.post('/', asyncHandler(async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user || !User.verifyPassword(req.body.password, user.password)) {
        return res.render('admincp/login', { error: 'Sai Tên đăng nhập hoặc Mật khẩu.' });
    }
    res.cookie('userId', user.id, { signed: true });
    res.redirect('/admincp');
}));

module.exports = router;