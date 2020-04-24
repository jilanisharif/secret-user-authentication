//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
    username:String,
    password:String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] } );

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req,res){
    res.render("register")
});

app.get("/login", function(req,res){
    res.render("login")
});




app.post("/register", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    const addUser = new User({
        username: username,
        password: password
    });
    addUser.save(function(err){
        if (!err) {
            res.render("secrets");
        } else {
            res.send(err);
        }
    })
});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({username:username}, function(err, foundOne){
        if(err){
            res.send(err);
        } else{
            if(foundOne){
                if(foundOne.password === password){
                    res.render("secrets");
                }
            }
        }
    });
})












app.listen(process.env.PORT || 3000, function(){
    console.log("server started");
    
})