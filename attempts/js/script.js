function init() {
    $('.main__table-curent').addClass('main__table-active');
    $('.navigation__curent-task').addClass('navigation-active');
}
function actions() {
    $('.navigation__item').on('click', function (e) {
        $('.main__table').removeClass('main__table-active');
        $('.navigation__item').removeClass('navigation-active');
        $('.navigation__item').eq($(e.target).index()).addClass('navigation-active');
        $('.main__table').eq($(e.target).index()).addClass('main__table-active');
    });


}
init();
actions();