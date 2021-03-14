var Global =
{
    init: function () {
        this.confirmDelete();
        this.reloadCaptcha();
        this.slugDemo();

        $('.datepicker').datepicker({
            changeYear: true,
            changeMonth: true,
        });
        $('.select2').select2();
    },

    confirmDelete: function () {
        $('.DeleteItem').click(function () {
            if (!confirm('Are you sure?')) {
                return false;
            }
        })
    },

    reloadCaptcha: function () {
        $('.reloadCaptcha').click(function (e) {
            var $captcha = $(".imageCaptcha");
            $captcha.attr('src', $captcha.attr('src') + '?' + Math.random());
            e.preventDefault();
        });
    },

    countDigits: function () {
        $('.countDigits').each(function () {
            var length = $(this).val().length;
            $(this).parent().append('<span class="countDigits"> (' + length + ')</span>');
            $(this).keyup(function () {
                var value = $(this).val();
                var valueLength = value.length;
                $(this).parent().find('.countDigits').html(' (' + valueLength + ')');
            })
        })
    },

    selectTypeBanner() {
        var value = $('.selectTypeBanner').val();
        if ($('.type_' + value).length) {
            $('.type_' + value).parents('.form-group ').show();
        } else {
            $('.typeCaption').parents('.form-group ').hide();
        }
        $('.selectTypeBanner').change(function () {
            var value = $(this).val();
            if ($('.type_' + value).length) {
                $('.type_' + value).parents('.form-group ').show();
            } else {
                $('.typeCaption').parents('.form-group ').hide();
            }
        })
    },

    selectShowHide: function () {
        $('.selectToShow').each(function () {
            var dataShow = $(this).data('show-mark');
            $('.hideWhenSelect-' + dataShow).hide().find('input, textarea').attr('disabled', 'disabled');
            var value = $(this).val();
            var classShow = dataShow + '-' + value;
            var showObject = $('.' + classShow);
            if (showObject.length) {
                showObject.show().find('input, textarea').removeAttr('disabled');
            }
            $(this).change(function () {
                $('.hideWhenSelect-' + dataShow).hide().find('input, textarea').attr('disabled', 'disabled');
                var value = $(this).val();
                var classShow = dataShow + '-' + value;
                var showObject = $('.' + classShow);
                if (showObject.length) {
                    showObject.show().find('input, textarea').removeAttr('disabled');
                }
            })
        })
    },

    slugDemo: function () {
        var slugDemoText = $('.slugDemo');
        $('.name_vieInput, .nameInput').keyup(function () {
            if ($('.slugInput').length) {
                $('.slugInput').val(ToolJsBackend.generateUrl($(this).val()));
                $('.slugInput').trigger('keyup');
            }
            if ($('.titleInput').length) {
                $('.titleInput').attr('placeholder', $(this).val());
            }
        });
        if ($('.name_vieInput, .nameInput').val()) {
            $('.titleInput').attr('placeholder', $('.name_vieInput').val());
        }
        if (slugDemoText.length) {
            var url = slugDemoText.text().replace('path-is-here', '<span class="slugHere" style="color:red;">path-is-here</span>');
            slugDemoText.html(url);
            if ($('.slugInput').val()) {
                $('.slugHere').html(ToolJsBackend.generateUrl($('.slugInput').val()));
            }
            $('.slugInput').keyup(function () {
                var newUrl = 'slug-is-here';
                if ($(this).val()) {
                    newUrl = ToolJsBackend.generateUrl($(this).val());
                }
                $('.slugHere').html(newUrl);
            });

        }
    },

    changeStatus: function () {
        $('.changeStatus').each(function () {
            $(this).click(function () {
                var currentStatus = $(this).attr('current_status');
                var field = $(this).attr('field');
                var url = $(this).attr('href') + '/' + currentStatus + '/' + field;
                var currentLink = $(this);
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'JSON',
                    beforeSend: function () {
                        currentLink.html('loading...')
                    },
                    success: function (data) {
                        if (data.success) {
                            currentLink.html(data.text);
                            currentLink.attr('current_status', data.newStatus);
                        }
                    }
                });
                return false;
            })
        })
    },

    checkTag: function () {
        var inputTag = $('.tagInput');
        var allTags = $('.item-existed');
        var boxExisted = $('.tags-existed');
        inputTag.keyup(function () {
            boxExisted.show();
            var value = $(this).val().toLowerCase();
            allTags.each(function () {
                if ($(this).html().toLowerCase().indexOf(value) != -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            })
        });
        inputTag.focusout(function () {
            boxExisted.hide();
        })
    }
};

var ToolJsBackend = {
    generateUrl: function (str) {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");
        /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
        str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1-
        str = str.replace(/^\-+|\-+$/g, "");
        //cắt bỏ ký tự - ở đầu và cuối chuỗi
        return str;
    }
};

var CheckAll =
{
    init: function () {
        var checkAll = $('#checkAll');
        var rows = $('.checkRows');
        var deleteLink = $('.deleteSelectedLink');
        checkAll.change(function () {
            if ($(this).is(':checked')) {
                rows.prop('checked', true);
                if ($('.checkRows').length) {
                    deleteLink.removeClass('disableLink');
                    $('.tr').addClass('f1');
                }
            } else {
                deleteLink.addClass('disableLink');
                rows.prop('checked', false);
                $('.tr').removeClass('f1');
            }
        });

        rows.each(function () {
            $(this).click(function () {
                var selectAll = true;
                var disableLink = true;
                if ($(this).is(':checked')) {
                    $(this).parents('.tr').addClass('f1');
                    rows.each(function () {
                        if (!$(this).is(':checked')) {
                            selectAll = false;
                        } else {
                            disableLink = false;
                        }
                    })
                } else {
                    $(this).parents('.tr').removeClass('f1');
                    selectAll = false;
                    rows.each(function () {
                        if ($(this).is(':checked')) {
                            disableLink = false;
                        }
                    })
                }
                if (disableLink) {
                    deleteLink.addClass('disableLink');
                } else {
                    deleteLink.removeClass('disableLink');
                }
                checkAll.prop('checked', selectAll);
            })
        });
        this.deleteSelected();
    },

    deleteSelected: function () {
        var deleteLink = $('.deleteSelectedLink');
        var rows = $('.checkRows');

        deleteLink.click(function (e) {
            if (!confirm('Bạn có chắc chắn muốn xoá những mục đã chọn?')) {
                return false;
            }
            var data = new Object();
            rows.each(function (i) {
                if ($(this).is(':checked')) {
                    data[$(this).val()] = $(this).val();
                }
            });
            $.ajax({
                url: deleteLink.attr('href'),
                type: 'POST',
                data: data,
                dataType: 'JSON',
                beforeSend: function () {
                    $('.imgLoading').show();
                },
                success: function (data) {
                    deleteLink.addClass('disableLink');
                    $('.imgLoading').hide();
                    $('#checkAll').prop('checked', false);
                    $('table .f1:not(".heading")').fadeOut(1000);
                }
            });
            e.preventDefault();
        })
    }
};

var OrderImage =
{
    init: function () {
        this.deleteImage();
        this.addImage();
        this.confirm();
    },

    deleteImage: function () {
        var deleteBtn = $('.deleteImage');
        deleteBtn.unbind('click').click(function (e) {
            $(this).parent().remove();
            e.preventDefault;
            return false;
        })
    },

    addImage: function () {
        var addBtn = $('.addImage');
        addBtn.click(function (e) {
            var model = $(this).data('model');
            if (typeof model == 'undefined') {
                model = 'Image'
            }

            var productId = $(this).data('product-id');
            var numberInput = parseInt($('.imageItem').length) + 1;
            var nameInput = 'data[' + model + '][' + numberInput + '][image]';
            var imageItem =
                '<div class="imageItem">' +
                '<input type="file" required="required" class="itemJs file_1" name="' + nameInput + '">' +
                '<input type="hidden" name="data[' + model + '][' + numberInput + '][product_id]" value="' + productId + '" id="Image' + numberInput + 'ProductId">' +
                '<a href="#" class="glyphicon glyphicon-trash deleteImage"></a>' +
                '</div>';
            $(this).parents('table').find('.input').append(imageItem);
            $('.file_1').removeClass('itemJs');
            OrderImage.deleteImage();
            e.preventDefault();
        })
    },

    confirm: function () {
        var nextBtn = $('.AddImage');
        nextBtn.click(function () {
            if (!$('.fileInput').val()) {
                $('#center').prepend('<h1 class="msgRed">Image is required</h1>');
                return false;
            }
            $('.msgRed').remove();
        });

        var prevBtn = $('.prevBtn');
        prevBtn.click(function () {
            $('.confirm').slideUp(function () {
                $('.tblImage').slideDown();
            });
        });

        var confirmBtn = $('.confirmBtn');
        confirmBtn.click(function () {
            var searchBox = $('.search-box');
            if (searchBox.is(':hidden')) {
                searchBox.slideDown();
            } else {
                searchBox.slideUp();
            }
        })
    }
};

var Image =
{
    init: function () {
        this.delete();
    },

    delete: function () {
        var deleteBtn = $('.deleteImageProduct');
        deleteBtn.each(function () {
            $(this).click(function () {
                if (!confirm('Bạn có chắc chắn muốn xoá?')) {
                    return false;
                }
                var currentImage = $(this);
                var url = $(this).attr('data-delete');
                $.ajax({
                    url: url,
                    dataType: 'JSON',
                    success: function (data) {
                        currentImage.remove();
                        if ($('.deleteImageProduct').length == 0) {
                            $('.productImages').remove();
                        }
                    }
                });
                return false;
            })
        })

    }
};

var Menu = {
    add: function () {
        var selectType = $('#MenuType');
        var selectDefault = $('.' + selectType.val());
        $(selectDefault).show();
        $(selectDefault).find('select').removeAttr('disabled');
        selectType.change(function () {
            $('.hideMenu').hide();
            $('.hideMenu').find('select').attr('disabled', 'disabled');
            var selectDefault = $('.' + selectType.val());
            $(selectDefault).find('select').removeAttr('disabled');
            $(selectDefault).show();
        })
    }
};

var ScrollTop =
{
    init: function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });

        // scroll body to 0px on click
        $('#back-top a').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    }
};

var Product =
{
    init: function () {
        this.searchProduct();
        this.showProperty();
    },

    searchProduct: function () {
        var searchBtn = $('.confirmBtn');
        searchBtn.click(function (e) {
            if ($('.formSearch').is(':hidden')) {
                $('.formSearch').slideDown();
            } else {
                $('.formSearch').slideUp();
            }
            e.preventDefault();
        })
    },

    showProperty: function () {
        var selectCategory = $('.selectCategoryProduct');
        if (!selectCategory.length || typeof categoryProperties == 'undefined') {
            return;
        }
        var currentValue = selectCategory.val();
        var propertyGroupIdCurrent = categoryProperties[currentValue];
        $('.showByCat').find('input').attr('disabled', 'disabled');
        if (typeof propertyGroupIdCurrent != 'undefined' && $('.showByCategoryFor_' + propertyGroupIdCurrent).length) {
            $('.showByCategoryFor_' + propertyGroupIdCurrent).show().find('input').removeAttr('disabled');
        }
        selectCategory.select2().on('change', function (e) {
            var value = e.val;
            var propertyGroupId = categoryProperties[value];
            $('.showByCat').hide().find('input').attr('disabled', 'disabled');
            if (typeof propertyGroupId != 'undefined' && $('.showByCategoryFor_' + propertyGroupId).length) {
                $('.showByCategoryFor_' + propertyGroupId).show().find('input').removeAttr('disabled');
            }
        })
    }
};

var Banner =
{
    init: function () {
        var formUrl = $('.formUrlBanner');
        formUrl.each(function () {
            var currentForm = $(this);
            $(this).ajaxForm({
                type: 'POST',
                dataType: 'JSON',
                beforeSerialize: function () {
                    formUrl.removeClass('selected');
                    currentForm.addClass('selected');
                    $('.message-update', currentForm).html(null);
                },
                beforeSend: function () {
                    $('.loadingImage', currentForm).show();
                },
                success: function (data) {
                    console.log(data['status']);
                    if (data.status == 'success') {
                        $('.loadingImage', currentForm).hide();
                        $('.message-update', currentForm).html(currentForm.data('message'));
                    }
                }
            })
        })
    }
};

$(document).ready(function () {
    Global.init();
    Global.changeStatus();
    Global.countDigits();
    Global.selectShowHide();
    Global.selectTypeBanner();
    Global.checkTag();
    OrderImage.init();
    Image.init();
    Menu.add();
    ScrollTop.init();
    Product.init();
    Banner.init();
    CheckAll.init();


    var showBoxImage = $('.showBoxImageHome');
    var boxImage = $('.boxImageHom');
    if (showBoxImage.is(':checked')) {
        boxImage.show();
    } else {
        boxImage.hide();
    }
    showBoxImage.change(function () {
        if ($(this).is(':checked')) {
            boxImage.show();
        } else {
            boxImage.hide();
        }
    })
});

// 
$('input.priceVND').keyup(function (event) {

    // skip for arrow keys
    if (event.which >= 37 && event.which <= 40) return;

    // format number
    $(this).val(function (index, value) {
        return value
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            ;
    });
});

//
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}