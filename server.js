require("dotenv").config();

const express=require("express");

const app=express();
var mongoose = require("mongoose");
var bodyParser=require("body-parser");
var UserModel=require("./model/User.model");
var NoteModel=require("./model/Note.model");
var connectDB=require("./db");
const bcrypt = require('bcryptjs');


app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

connectDB();

app.post("/adduser",async(req,res)=>{
   var{username,password}=req.body;
   var salt=await bcrypt.genSalt(10);
   var hashedPassword = await bcrypt.hash(password, salt);
   var newUser = new UserModel({
            username,
            password: hashedPassword 
        });
        await newUser.save();
        res.redirect("/sign_up_form.html")

    
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Search for the user
        const user = await UserModel.findOne({ username: username });

        if (!user) {
            return res.send("User not found. Please sign up first.");
        }

        // 2. Compare passwords (now await works because we aren't inside a .then)
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({
                    success: true,
                    userId: user._id,
                    redirectUrl: "/sticky_notes.html"
            });
            console.log(user._id);
        } else {
            res.send("Incorrect password. Please try again.");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred during login.");
    }
});










app.get("/",(req,res)=>{
    res.send("hamaya....")
})



app.listen(process.env.PORT ||3600,()=>{
    console.log("server 3600 lo run avutundi ._.")
})