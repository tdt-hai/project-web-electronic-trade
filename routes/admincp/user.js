const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../../services/user');

const router = new Router();

router.get('/profile', asyncHandler(async (req, res) => {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    }
    res.render('admincp/userProfile', { user: req.currentUser, error: null });
}));

router.post('/profile', asyncHandler(async (req, res) => {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    }

    const user = await User.findOne({ where: { username: req.body.username } });
    const currentUser = await User.findByPk(req.currentUser.id);

    if (!user || user.id != currentUser.id) {
        return res.render('admincp/userProfile', { user: req.currentUser, error: 1 });
    }

    await user.updateProfile(req.body.displayName, req.body.email);

    const currentUserSave = await User.findByPk(req.currentUser.id);
    req.currentUser = currentUserSave;
    res.locals.currentUser = currentUserSave;

    res.render('admincp/userProfile', { user: currentUserSave, error: 0 });
}));

router.get('/changePassword', asyncHandler(async (req, res) => {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    }
    res.render('admincp/userChangePassword', { error: null });
}));

router.post('/changePassword', asyncHandler(async (req, res) => {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    }

    const user = await User.findByPk(req.currentUser.id);

    if (!user || !User.verifyPassword(req.body.old_password, user.password) || req.body.new_password != req.body.password) {
        return res.render('admincp/userChangePassword', { error: 1 });
    }

    const pwHashed = await User.hashPassword(req.body.password);
    await user.updatePassword(pwHashed);

    res.render('admincp/userChangePassword', { error: 0 });
}));

module.exports = router;