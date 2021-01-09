const express = require("express");

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname + '/client'))
var mongoose = require("mongoose");
const uri = "mongodb+srv://bdzanko1:PzrHmyh4OjcCabeP@cluster0.s4065.mongodb.net/baza?retryWrites=true&w=majority";
var items = require("./models/items")
//Povezivanje sa bazom
try {
    mongoose.connect(
      uri,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Connected to db :)")
  } catch (error) {
    console.log(error);
  }


io.on('connection', (socket) => {
    console.log('a user is connected')
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
      });
    



    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

})

//Localhost:3000/createItem da kao admin kreira item
app.get("/createItem",(req,res)=>{
    var item = new items({name :"cevapi",
    count:10})
    item.save((err, doc) => {
        if (err) console.log(err);
        console.log("Succesefully inserted item");
    });
})

http.listen(3000, () => {
    console.log('listening on *:3000');
});