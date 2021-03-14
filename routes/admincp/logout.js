module.exports = (req, res) => {
    res.clearCookie('userId');
    res.redirect('/admincp');
};