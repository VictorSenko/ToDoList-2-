function init() {
    $('.main__table-curent').addClass('main__table-active');
   
}
function actions() {
    $('.navigation__item').on('click', function (e) {
        $('.main__table').removeClass('main__table-active');
        $('.main__table').eq($(e.target).index()).addClass('main__table-active');
    });
}
init();
actions();