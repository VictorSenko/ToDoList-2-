class TaskCreator {
    constructor(obj) {
        this.name = obj.name;
        this.description = obj.description;
        this.priority = obj.priority;
        this.status = obj.status;
        this.timeAttr = obj.timeAttr;
    }
    taskDrow() {
        let item;
        let buttons;
        if (this.status === 'curent') {
            item = $('.main__table-curent .task__container');
            buttons = '<div class="buttons__wrapper">' +
                '<div class="complete-button task__button">Complete</div>' +
                '<div class="edit-button task__button">Edit</div>' +
                '<div class="delete-button task__button">Delete</div></div>';
        }
        if (this.status === 'executed') {
            item = $('.main__table-executed .task__container');
            buttons = '<div class="buttons__wrapper">' +
                '<div class="edit-button task__button">Edit</div>' +
                '<div class="delete-button task__button">Delete</div></div>';
        }

        if (this.status === 'deleted') {
            item = $('.main__table-deleted .task__container');
            buttons = '<div class="buttons__wrapper">' +
                '<div class="recover-button task__button"">Recover</div></div>';

        }

        item.append('<div class = "task__wrapper"><div class= "main__table-obj" data-time = "' +
                                                             this.timeAttr + '">' +
            '<div class="main__table-task">' + this.name + '</div >' +
            '<div class="main__table-task">' + this.description + '</div>' +
            '<div class="main__table-task">' + this.priority + '</div></div>' + buttons + '</div>');
    }
}


function init() {
    let taskArr;
    if (localStorage.getItem('task') !== null) {
        taskArr = JSON.parse(localStorage.getItem('task'));
    }
    else
        taskArr = [];
    $('.main__table-curent').addClass('main__table-active');
    $('.navigation__curent-task').addClass('navigation-active');
    actions();
    tableDrow(taskArr);
    return taskArr;
}
taskArr = init();
function modalMuve(e) {
    if ($(e.target).hasClass('modal__move')) {
        let leftOffset = e.offsetX;
        let topOffset = e.offsetY;
        $('body').on('mousemove', function (e) {

            if ($(e.target).hasClass('modal__move')) {
                let x = e.pageX - leftOffset;
                let y = e.pageY - topOffset;

                $('.modal__add-task').css({
                    'transform': 'translateX(0)',
                    'left': x + 'px',
                    'top': y + 'px'
                });
            }
        });
    }
}



function tableDrow(taskArr) {
    taskArr.map(function (elem) {
        elem = new TaskCreator(elem);
        elem.taskDrow();
    });
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

    //modal movement
    
    $('body').on('mousedown', function (e) {
        modalMuve(e);
    });
    $('body').on('mouseup', function (e) {
        $('body').unbind('mousemove');
    });

    //create task
    $('.create__task-button').on('click', function () {
        let newTask = {
            name: $('.task__name-input').val(),
            description: $('.task__description-input').val(),
            priority: $("input:checked").val(),
            status: 'curent',
            timeAttr: Date.parse(new Date())
        };
        newTask = new TaskCreator(newTask);
        $('.task__name-input').val('');
        $('.task__description-input').val('');
        $('.modal__wrapper').css('display', 'none');
        taskArr.push(newTask);
        localStorage.setItem('task', JSON.stringify(taskArr));
        newTask.taskDrow();
    });
    //buttons style
    $('.main__table').on('mousedown', function (e) {
        if ($(e.target).hasClass('task__button')) {
            $(e.target).css({
                'box-shadow': 'none',
                'margin': '2px 0 0 0px'
            });
            let time = $('.main__table-obj').eq($(e.target).closest($('.task__wrapper')).index()).attr('data-time');
        }
    });
    $('.main__table').on('mouseup', function (e) {
        $('.task__button').css({
            'box-shadow': '1px 3px 2px grey',
            'margin': '0'
        });
    });
    //buttons onclick
    $('.main__table').on('click', function (e) {
        let time = $(e.target.parentElement.previousSibling).attr('data-time');
        if ($(e.target).hasClass('delete-button')) {
            taskArr.map(function (elem) {
                if (elem.timeAttr === +time) {
                    elem.status = 'deleted';
                }
            });
        }
        if ($(e.target).hasClass('complete-button')) {
            taskArr.map(function (elem) {
                if (elem.timeAttr === +time) {
                    elem.status = 'executed';
                }
            });
        }
        if ($(e.target).hasClass('edit-button')) {
            console.log('editFunction');
        }
        if ($(e.target).hasClass('recover-button')) {
            taskArr.map(function (elem) {
                if (elem.timeAttr === +time) {
                    elem.status = 'curent';
                }
            });
            
        }
        $('.task__container').empty();
        tableDrow(taskArr);
        localStorage.setItem('task', JSON.stringify(taskArr));
    });

}



