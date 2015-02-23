'use strict';

var is_html5_audio, audio;

$(function() {
    is_html5_audio = (String(Audio).indexOf('HTMLAudioElement') > 0);
});

function audioStart(src) {
    audio = getAudio(src);
    audio.play();
}

function audioStop() {
    if (is_html5_audio) {
        audio.pause();
    } else {
        audio.stop();
        audio.release();
    }
}

function getAudio(src) {
    // HTML5
    if (is_html5_audio) {
        return new Audio(src);
    }
    // Phonegap media
    if (device.platform.toLowerCase() === 'android') {
        // Android needs the search path explicitly specified
        src = getPath() + src;
    }
    return new Media(src, null, function(error) {
        alert(src + ':' + JSON.stringify(error));
    });
}

function getPath() {
    var str = location.href;
    var i = str.lastIndexOf('/');
    return str.substring(0, i + 1);
}