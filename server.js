const express = require("express");
require('dotenv').config()
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname + '/client'))
var mongoose = require("mongoose");
const uri = "mongodb+srv://bdzanko1:PzrHmyh4OjcCabeP@cluster0.s4065.mongodb.net/baza?retryWrites=true&w=majority";
var items = require("./models/items")
const jwt = require('jsonwebtoken');
app.use(express.json())
var bcrypt = require("bcrypt");

const users = require("./models/users");
const { schema } = require("./models/users");
// Povezivanje sa bazom
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
app.post("/createItem", authenticateToken, (req,res)=>{
  if(req.user.user.role === 'admin'){
    var item = new items(req.body.item)
    console.log(req.body)
    item.save((err, doc) => {
        if (err) console.log(err);
        console.log("Succesefully inserted item");
    });
  }else return res.status(500)
})

app.post("/register", async (req,res) => {
  var user = new users(req.body.user)
  user.password= users.hashPassword(user.password)
  if(await users.exists({email: user.email})) return res.status(500).send('error')
  user.save((err, doc) => {
    if (err) console.log(err);
    console.log("Succesefully registered user");
  });
  return res.status(200).json(user)
})


app.get('/posts', authenticateToken, async (req,res) => {
  const user = await users.findOne({email: req.user.email})
  return res.status(200).json(user)
})


//Login
app.post('/login', async (req,res) => {
  // Pristup useru 
  const user = await users.findOne({email: req.body.email})
  const pw = users.hashPassword(req.body.password)
  if(user.isValid(req.body.password)){
    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken})
    console.log('DA')
  }else return res.status(500)
})

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    req.user = user
    next()
  })
}


http.listen(3000, () => {
  console.log('listening on *:3000');
});