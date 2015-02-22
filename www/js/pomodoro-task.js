'use strict';

var todo = [];
var done = [];
var max_id = 0;

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
    $('.todo').draggable();
    $('#drop-here').droppable({
        drop: function(event, ui) {
            ui.draggable.children('.finish').click();
        }
    });
}

function setTodoTasks() {
    $('#todo-area').empty();
    todo.forEach(function(element) {
        var id = element.id;
        var tomatoes = '';
        var task = element.task.replace(/\r?\n/g, '<br>');
        var finish_button = '<button class="btn btn-primary pull-right finish">Finish</button>';

        for (var i = 0; i < element.pomodoro_num; i++) {
            tomatoes = tomatoes + '<img src="img/tomato.png" alt="tomato">';
        }
        $('#todo-area').append('<div data-id="' + id + '" class="todo task"><div class="content">' + tomatoes + '<br>' + task + '</div>' + finish_button + '</div>');
        setFinishEvent({
            id: id,
            pomodoro_num: element.pomodoro_num,
            task: element.task,
            time: Date.now()
        });
    });
}

function setFinishEvent(object) {
    $('[data-id="' + object.id + '"] .finish').click(function() {
        todo = todo.filter(function(element) {
            return (element.id !== object.id);
        });
        done.push(object);
        setStorage();
        setTasks();
    });
}

function setDoneTasks() {
    $('#done-area').empty();
    done.forEach(function(element) {
        var tomatoes = '';
        for (var i = 0; i < element.pomodoro_num; i++) {
            tomatoes = tomatoes + '<img src="img/tomato.png" alt="tomato">';
        }
        var task = element.task.replace(/\r?\n/g, '<br>');
        var date = '<div class="pull-right">' + formatDate(new Date(element.time), 'YYYY/MM/DD hh:mm:ss') + '</div>';
        $('#done-area').append('<div data-id="' + element.id + '" class="done task"><div class="content">' + tomatoes + '<br>' + task + '</div>' + date + '</div>');

    });
}