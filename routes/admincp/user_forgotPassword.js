const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../../services/user');
const Email = require('../../services/email');

const router = new Router();

router.get('/', asyncHandler(async (req, res) => {
    res.render('admincp/user_forgotPassword', { error: null, page_name: 'user_forgotPassword' });
}));

router.post('/', asyncHandler(async (req, res) => {
    const found = await User.findOne({ where: { email: req.body.email } });

    if (!found) {
        return res.render('admincp/user_forgotPassword', { error: 1 });
    }

    found.addToken();
    await Email.send(found.email, 'Quên mật khẩu - AeMobile <no-reply>', `<b>Vui lòng không chia sẻ link cho bất kỳ ai để tránh mất tài khoản!</b><br>Click vào đường dẫn để đặt lại mật khẩu: <a href="${process.env.BASE_URL}/admincp/user/forgotpassword/${found.id}/${found.token}">${process.env.BASE_URL}/admincp/user/forgotpassword/${found.id}/${found.token}</a>`);

    res.render('admincp/user_forgotPassword', { error: 0, page_name: 'user_forgotPassword' });
}));

router.get('/:id/:token', asyncHandler(async (req, res) => {
    const { id, token } = req.params;

    const user = await User.findByPk(id);

    if (user && user.token == token) {
        return res.render('admincp/user_updatePassword', { user, error: null, page_name: 'user_updatePassword' });
    }

    return res.redirect(`/admincp`);
}));

router.post('/:id/:token', asyncHandler(async (req, res) => {
    const { id, token } = req.params;

    const user = await User.findByPk(id);
    if (user && user.token == token) {
        if (req.body.password == req.body.password_again) {
            const hashedPassword = await User.hashPassword(req.body.password);
            await user.updatePassword(hashedPassword);
            await user.tokenNull();

            return res.render('admincp/user_updatePassword', { user, error: 0, page_name: 'user_updatePassword' });
        }
    }

    await user.tokenNull();
    return res.render('admincp/user_updatePassword', { user, error: 1, page_name: 'user_updatePassword' });
}));

module.exports = router;