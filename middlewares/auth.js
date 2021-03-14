const asyncHandler = require('express-async-handler');
const moment = require('moment');
const User = require('../services/user');

module.exports = asyncHandler(async (req, res, next) => {
    res.locals.cartAllAmount = req.session.cartAllAmount;
    res.locals.cartAll = req.session.cartAll;
    res.locals.moment = moment;

    res.locals.haveSession = false;
    if (req.session.cartAllAmount) {
        res.locals.haveSession = true;
    }

    const userId = req.signedCookies.userId;
    if (!userId) {
        return next();
    }
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
        return next();
    }
    req.currentUser = user;
    res.locals.currentUser = user;
    next();
});