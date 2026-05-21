require("dotenv").config();
const express=require("express");
const app=express();
var mongoose = require("mongoose");
var bodyParser=require("body-parser");
var connectDB=require("./db");



app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

connectDB();

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));


app.get("/",(req,res)=>{
    res.redirect("/sign_up_form.html");
})



app.listen(process.env.PORT ||3600,()=>{
    console.log("server 3600 lo run avutundi ._.")
})