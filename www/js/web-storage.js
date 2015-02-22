'use strict';

var storage = localStorage;

function setStorage() {
    storage.setItem('max_id', max_id);
    storage.setItem('todo', JSON.stringify(todo));
    storage.setItem('done', JSON.stringify(done));
}

function clearStorage() {
    storage.clear();
}