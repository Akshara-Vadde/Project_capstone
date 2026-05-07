const express=require("express");
const app=express();

app.get("/",(req,res)=>{
    res.send("hamaya....")
})

app.listen(3600,()=>{
    console.log("server 3600 lo run avutundi ._.")
})