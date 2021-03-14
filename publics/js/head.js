jQuery(document).ready(function ($) {
    if (localStorage.getItem('local_cartAllAmount') == null) {
        localStorage.setItem('local_cartAllAmount', parseInt($('.basket-cart-amount').text()));
    } else {
        if ($('.basket-cart-amount').text() != localStorage.getItem('local_cartAllAmount')) {
            if (`<%= haveSession %>` == 'false') {
                localStorage.setItem('local_cartAllAmount', 0);
            }
            localStorage.setItem('local_cartAllAmount', parseInt($('.basket-cart-amount').text()));
            location.reload();
        }
    }
});