//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true , useUnifiedTopology: true});


const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

const secret = "Thisisourlittlesecret."
const User = new mongoose.model("User",userSchema);

userSchema.plugin(encrypt,{secret: secret , encryptedFields: ["password"]});
app.get('/',function(req, res){
res.render('home');
});
app.get('/login',function(req, res){
res.render('login');
});
app.get('/register',function(req, res){
res.render('register');

});

app.post('/register',function(req,res){

    
        const newUser = new User({
            email: req.body.username,
            password: md5(req.body.password)
        });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render('secrets');
        }
      });
   });

app.post('/login',function(req,res){
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email: username}, function(err,foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result === true){
                        res.render('secrets');
                    }
                });    
            }
        }
    });
});
app.listen(3000,function(){
console.log("server are starting port 3000");
});