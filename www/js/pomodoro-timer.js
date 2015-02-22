'use strict';

var STATUS = {WORKING: 'WORKING', RESTING: 'RESTING'};
var AUDIO_LIST = {
    ALERT: new Audio('sounds/alert.mp3'),
    BGM: new Audio('sounds/bgm.mp3')
};
var PERIOD = {WORKING: 5, RESTING:3};
var OPTIONS = {
    WORKING: {
        easing: 'linear',
        scaleLength: 0,
        lineWidth: 10,
        size: 210,
        onStep: function(value) {
            $(this.el).find('#working-time-view').text( Math.round(value * PERIOD.WORKING / 100) + ' / ' + PERIOD.WORKING + ' min');
        }
    },
    RESTING: {
        easing: 'linear',
        scaleLength: 0,
        barColor: '#0000FF',
        lineWidth: 10,
        size: 210,
        onStep: function(value) {
            $(this.el).find('#resting-time-view').text( Math.round(value * PERIOD.RESTING / 100) + ' / ' + PERIOD.RESTING + ' min');
        }
    }
};
var current_status = STATUS.WORKING;
var intervalID;
var current_time=0;

$(function() {
    setupTimer();

    $('#start').click(function() {
        startTimer(PERIOD[current_status]);
        $('#start').toggleClass('disabled');
        $('#pause').toggleClass('disabled');
    });

    $('#pause').click(function() {
        clearInterval(intervalID);
        $('#start').toggleClass('disabled');
        $('#pause').toggleClass('disabled');
    });

    $('#reset').click(function() {
        location.reload();
    });

});

function setupTimer(){
    $('#working-timer').easyPieChart(OPTIONS.WORKING);
    $('#resting-timer').easyPieChart(OPTIONS.RESTING);
    $('#working-timer').hide();
    $('#resting-timer').hide();
    getCurrentTimer().show();
}

function toggleChart(){
    getCurrentTimer().hide();
    current_status = (current_status === STATUS.WORKING) ? STATUS.RESTING : STATUS.WORKING;
    getCurrentTimer().show();
}

function startTimer(period){
    intervalID = setInterval(updateTimer, 1000);
}

function updateTimer(){
    current_time = current_time + 1;

    getCurrentTimer().data('easyPieChart').update( current_time / PERIOD[current_status] * 100 );
    if(current_time > PERIOD[current_status]){
        resetTimer();
        toggleChart();
        startTimer();
    }
}

function getCurrentTimer(){
    return (current_status === STATUS.RESTING) ? $('#resting-timer') : $('#working-timer');
}

function resetTimer(){
    clearInterval(intervalID);
    current_time = 0;
    $('#working-timer').data('easyPieChart').update(0);
    $('#working-time-view').text('0 / ' + PERIOD.WORKING + ' min');
    $('#resting-timer').data('easyPieChart').update(0);
    $('#resting-time-view').text('0 / ' + PERIOD.RESTING + ' min');
}