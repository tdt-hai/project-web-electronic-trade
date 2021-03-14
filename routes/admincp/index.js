module.exports = function index(req, res) {
    if (!req.currentUser) {
        return res.redirect('/admincp/login');
    }
    res.redirect('/admincp/product');
};