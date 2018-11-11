function init() {
    $('.main__table-curent').addClass('main__table-active');
    $('.navigation__curent-task').addClass('navigation-active');
}
function actions() {
    //navigation switcher
    $('.navigation__item').on('click', function (e) {
        $('.main__table').removeClass('main__table-active');
        $('.navigation__item').removeClass('navigation-active');
        $('.navigation__item').eq($(e.target).index()).addClass('navigation-active');
        $('.main__table').eq($(e.target).index()).addClass('main__table-active');
    });
    //Add Task button
    $('.open__modal-add').on('click', function () {
        $('.modal__wrapper').css('display','block');
    });
    $('body').on('click', function (e) {
        if ($(e.target).hasClass('modal__exit-button') || $(e.target).hasClass('modal__wrapper')) {
            $('.modal__wrapper').css('display', 'none');
        }
    });
}
init();
actions();