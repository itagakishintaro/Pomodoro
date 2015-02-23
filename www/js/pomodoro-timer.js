'use strict';

var AUDIO_LIST = {
    ALERT: 'sounds/alert.mp3',
    RESTING: 'sounds/bgm.mp3'
};
var STATUS = {
    WORKING: 'WORKING',
    RESTING: 'RESTING'
};
var PERIOD = {
    WORKING: 25 * 60,
    RESTING: 5 * 60
};
var OPTIONS = {
    WORKING: {
        easing: 'linear',
        scaleLength: 0,
        barColor: '#FF9800',
        lineWidth: 10,
        size: 210,
        onStep: function(value) {
            $(this.el).find('#working-time-view').text(Math.floor(value * PERIOD.WORKING / 100 / 60) + ' / ' + PERIOD.WORKING / 60 + ' min');
        }
    },
    RESTING: {
        easing: 'linear',
        scaleLength: 0,
        barColor: '#4CAF50',
        lineWidth: 10,
        size: 210,
        onStep: function(value) {
            $(this.el).find('#resting-time-view').text(Math.floor(value * PERIOD.RESTING / 100 / 60) + ' / ' + PERIOD.RESTING / 60 + ' min');
        }
    }
};
var current_status = STATUS.WORKING;
var intervalID;
var current_time = 0;
var inMusic;

$(function() {
    setupTimer();

    $('#start').click(function() {
        startTimer(PERIOD[current_status]);
        $('#start').toggleClass('disabled');
        $('#pause').toggleClass('disabled');
        if(inMusic){
            audio.play();
        }
    });

    $('#pause').click(function() {
        clearInterval(intervalID);
        $('#start').toggleClass('disabled');
        $('#pause').toggleClass('disabled');
        if(!audio.paused){
            inMusic = true;
            audioStop();
        } else{
            inMusic = false;
        }
    });

    $('#reset').click(function() {
        location.reload();
    });

});

function setupTimer() {
    $('#working-timer').easyPieChart(OPTIONS.WORKING);
    $('#resting-timer').easyPieChart(OPTIONS.RESTING);
    $('#working-timer').hide();
    $('#resting-timer').hide();
    getCurrentTimer().show();
}

function toggleChart() {
    getCurrentTimer().hide();
    current_status = (current_status === STATUS.WORKING) ? STATUS.RESTING : STATUS.WORKING;
    getCurrentTimer().show();
}

function startTimer(period) {
    intervalID = setInterval(updateTimer, 1000);
    if(current_status === STATUS.RESTING){
        audioStart(AUDIO_LIST.RESTING);
    }
}

function updateTimer() {
    current_time = current_time + 1;

    getCurrentTimer().data('easyPieChart').update(current_time / PERIOD[current_status] * 100);
    // alert before 5 sec when woking.
    if (current_status === STATUS.WORKING && current_time === PERIOD[current_status] - 10) {
        audioStart(AUDIO_LIST.ALERT);
    }
    if (current_time > PERIOD[current_status]) {
        audioStop();
        resetTimer();
        toggleChart();
        startTimer();
    }
}

function getCurrentTimer() {
    return (current_status === STATUS.RESTING) ? $('#resting-timer') : $('#working-timer');
}

function resetTimer() {
    clearInterval(intervalID);
    current_time = 0;
    $('#working-timer').data('easyPieChart').update(0);
    $('#working-time-view').text('0 / ' + PERIOD.WORKING / 60 + ' min');
    $('#resting-timer').data('easyPieChart').update(0);
    $('#resting-time-view').text('0 / ' + PERIOD.RESTING / 60 + ' min');
}