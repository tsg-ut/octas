const url = (process.env.NODE_ENV === 'production')
? 'https://octas.herokuapp.com/'
: process.env.OCTAS_API || 'http://localhost:3000/';
const socketIO = require('socket.io-client');

$(document).ready(() => {
    const socket = socketIO(url);
    $('a.btn-twitter').attr('href', new URL('/login/twitter', url));

    socket.on('hello', (username) => {
        $('.connecting').addClass('hide');
        $('.username').text(username);
        $('.lobby').removeClass('hide');
    });
    socket.on('need-signin', () => {
        $('.connecting').addClass('hide');
        $('.need-signin').removeClass('hide');
    });
});