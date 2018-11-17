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
function createTask() {
    let newTask = {
        name: $('.task__name-input').val(),
        description: $('.task__description-input').val(),
        priority: $("input:checked").val(),
        status: 'curent',
        timeAttr: Date.parse(new Date())
    };
    newTask = new TaskCreator(newTask);
    $('.modal__wrapper').css('display', 'none');
    taskArr.push(newTask);
    localStorage.setItem('task', JSON.stringify(taskArr));
    newTask.taskDrow();
}
function editTask(editableTask) {
    
    let newTask = {
        name: $('.task__name-input').val(),
        description: $('.task__description-input').val(),
        priority: $("input:checked").val(),
        status: editableTask.status,
        timeAttr: editableTask.timeAttr
    };
    newTask = new TaskCreator(newTask);
    $('.modal__wrapper').css('display', 'none');

    for (let i = 0, len = taskArr.length; i < len; i++) {
        if (taskArr[i].timeAttr === newTask.timeAttr) {
            taskArr[i] = newTask;
        }
    }
    localStorage.setItem('task', JSON.stringify(taskArr));
    tableDrow(taskArr);
}
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
    $('.task__container').empty();
    taskArr.map(function (elem) {
        elem = new TaskCreator(elem);
        elem.taskDrow();
    });
}
function validateStylesDefault() {
    $('.modal__add-task').css('border', 'none');
    $('.task__name-input').removeClass('input_border');
    $('.task__name-input').attr('placeholder', 'Name');
    $('span.validation-warning').remove();
    $('span.validation-checkbox-warning').remove();
}
function validate() {

    validateStylesDefault();

    if ($('.task__name-input').val().length < 1) {
        $('.task__name-input').css({
            'border': '2px solid #b61c1c'
        });
        $('.task__name-input').attr('placeholder', 'enter the name');
        return false;
    }
    else if ($('.task__name-input').val().length < 4) {
        $('.task__name-input').addClass('input_border');
        $('.task__name-input').after('<span class="validation-warning">Task name is too short</span>');
        return false;
    } else if ($("input:radio:checked").length < 1) {
        $('.task__name-input').after('<span class="validation-checkbox-warning">select task priority</span>');
        $('.modal__add-task').css('border', '1px solid red');
    } else {
        return true;
    }
}
function taskChange(status, time) {
    taskArr.map(function (elem, i) {
        if (elem.timeAttr === +time) {
            elem.status = status;
            let item = taskArr.splice(i, 1);
            taskArr.push(item[0]);
        }
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
        $('.task__name-input').val('');
        $('.task__description-input').val('');
        $('.radio').each(function () {
            this.checked = false;
        });
        $('.modal__wrapper').css('display', 'block');
        if ($('.modal__add-task').children().hasClass('edit__task-button')) {
            $('.modal__add-task').children('.edit__task-button').remove();
            $('.modal__add-task').append('<button class="create__task-button">Create Task</button>');
        }
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
        if (validate())
            createTask();
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
        if ($(e.target).hasClass('main__table-task')) {
            time = $(e.target.parentElement).attr('data-time');
        }
        //delete
        if ($(e.target).hasClass('delete-button')) {
            taskChange('deleted',time);
        }
        //complete
        if ($(e.target).hasClass('complete-button')) {
            taskChange('executed', time);
        }
        //edit
        if ($(e.target).hasClass('edit-button') || $(e.target).hasClass('main__table-task')) {
            let editableTask;
            $('.modal__wrapper').css('display', 'block');
            if ($('.modal__add-task').children().hasClass('create__task-button')) {
                $('.modal__add-task').children('.create__task-button').remove();
                $('.modal__add-task').append('<button class="edit__task-button">Edit Task</button>');
                //add eventlistener on edit task button
                $('.edit__task-button').on('click', function () {
                    if (validate()) {
                        taskArr.map(function (elem,i) {
                            if (elem.timeAttr === +time) {
                                editableTask = elem;
                            }
                            console.log(editableTask);
                        });
                        editTask(editableTask);
                    }
                });
            }
            taskArr.map(function (elem,i) {
                if (elem.timeAttr === +time) {
                    editableTask = elem;
                }
            });
            $('.task__name-input').val(editableTask.name);
            $('.task__description-input').val(editableTask.description);
            $('.radio').each(function (i, elem) {
                if (elem.value === editableTask.priority) {
                    elem.checked = true;
                }
            });
        }

        //recover
        if ($(e.target).hasClass('recover-button')) {
            taskChange('curent', time);
        }
        
        tableDrow(taskArr);
        localStorage.setItem('task', JSON.stringify(taskArr));
    });
    $('.task__name-input').on('keypress', function() {
        validateStylesDefault();
    });
}



