'use strict';

var todo = [];
var done = [];
var max_id = 0;
var delete_button = '<button class="btn btn-sm btn-default pull-left delete">Delete</button>';
var finish_button = '<button class="btn btn-sm btn-primary pull-right finish">Finish</button>';

$(function() {
    // clear web storage
    $('#all-clear').click(function() {
        clearStorage();
        location.reload();
    });
    // Read web storage
    if (storage.length > 0) {
        max_id = storage.getItem('max_id');
        todo = JSON.parse(storage.getItem('todo'));
        done = JSON.parse(storage.getItem('done'));
    }

    setTasks();

    // set add event
    $('#add-task').click(function() {
        addTodo();
        $('#pomodoro-num').val(1);
        $('#task').val('');
        setStorage();
    });
});

function addTodo() {
    var pomodoro_num = Number($('#pomodoro-num').val());
    var task = $('#task').val();
    // setMaxId();
    max_id++;
    todo.push({
        id: max_id,
        pomodoro_num: pomodoro_num,
        task: task,
        time: Date.now()
    });
    setTasks();
}

function done(object) {
    done.push(object);
}

function setTasks() {
    setTodoTasks();
    setDoneTasks();
    setDragAndDrop();
}

function setDragAndDrop() {
    $('.task').draggable();
    // $('#drop-here').droppable({
    //     drop: function(event, ui) {
    //         ui.draggable.children('.finish').click();
    //     }
    // });
}

function setTodoTasks() {
    $('#todo-area').empty();
    todo.forEach(function(element) {
        var id = element.id;
        var task = element.task.replace(/\r?\n/g, '<br>');
        var tomatoes = createTomatoes(element.pomodoro_num);
        $('#todo-area').append('<div data-id="' + id + '" class="todo task"><div class="content">' + tomatoes + '<br>' + task + '</div>' + delete_button + finish_button + '</div>');
        setDeleteEvent(element);
        setFinishEvent(element);
    });
}

function setDeleteEvent(object) {
    $('[data-id="' + object.id + '"] .delete').click(function() {
        todo = todo.filter(function(element) {
            return (element.id !== object.id);
        });
        done = done.filter(function(element) {
            return (element.id !== object.id);
        });
        setStorage();
        setTasks();
    });
}

function setFinishEvent(object) {
    $('[data-id="' + object.id + '"] .finish').click(function() {
        todo = todo.filter(function(element) {
            return (element.id !== object.id);
        });
        object.time = Date.now();
        done.push(object);
        setStorage();
        setTasks();
    });
}

function setDoneTasks() {
    $('#done-area').empty();
    done.forEach(function(element) {
        var tomatoes = createTomatoes(element.pomodoro_num);
        var task = element.task.replace(/\r?\n/g, '<br>');
        var date = '<div class="pull-right">' + formatDate(new Date(element.time), 'YYYY/MM/DD hh:mm:ss') + '</div>';
        $('#done-area').append('<div data-id="' + element.id + '" class="done task"><div class="content">' + tomatoes + '<br>' + task + '</div>' + delete_button + date + '</div>');
        setDeleteEvent(element);
    });
}

function createTomatoes(number) {
    var tomatoes = '';
    for (var i = 0; i < number; i++) {
        tomatoes = tomatoes + '<img src="img/tomato.png" alt="tomato" class="tomato">';
    }
    return tomatoes;
}