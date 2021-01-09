const express = require("express");

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname + '/client'))


app.get('/login', (req, res) => {

  res.sendFile(__dirname + '/client/login.html');
});

app.get('/register', (req, res) => {

  res.sendFile(__dirname + '/client/register.html');
});

io.on('connection', (socket) => {
    console.log('a user is connected')

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
      });



    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

})

http.listen(3000, () => {
    console.log('listening on *:3000');
});
