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
           return res.status(404).json({ success: false, message: "User not found." });
        }

        // 2. Compare passwords (now await works because we aren't inside a .then)
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({
                    success: true,
                    userId: user._id,
                    redirectUrl: "/sticky_note.html"
            });
            console.log(user._id);
        } else {
            return res.status(401).json({ success: false, message: "Incorrect password." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred during login.");
    }
});





app.post("/addnote", async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        
        const newNote = new NoteModel({
            title: title || "New Note",
            description: description,
            userId: userId,
            x: 100,
            y: 100
        });

        const savedNote = await newNote.save();
        res.json({ success: true, note: savedNote });
    } catch (err) {
        console.error("ADD NOTE ERROR:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});


app.get("/getnotes/:userId",async(req,res)=>{
  try{
    var userId=req.params.userId;
    var notes=await NoteModel.find({userId:userId}).sort({createdAt:-1});
    res.json(notes);
  }catch(err){
        res.status(500).json({error:"failed to fetch notes"});
  }
});

app.put("/updatenote", async (req, res) => {
    try {
        const { id, title, description, x, y } = req.body;

        // Check if ID is a valid MongoDB ObjectId string (24 chars)
        if (!id || id.length !== 24) {
            return res.status(400).json({ success: false, message: "Invalid ID format" });
        }

        const updatedNote = await NoteModel.findByIdAndUpdate(
            id,
            { title, description, x, y },
            { new: true }
        );

        res.json({ success: true, note: updatedNote });
    } catch (err) {
        console.error("Update Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete("/deletenote/:userId",async(req,res)=>{
    try {
        const noteId = req.params.userId;

        
        if (!noteId || noteId.length !== 24) {
            return res.status(400).json({ success: false, message: "Invalid Note ID" });
        }

        
        const deletedNote = await NoteModel.findByIdAndDelete(noteId);

        if (!deletedNote) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        res.json({ success: true, message: "Note deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});


app.get("/",(req,res)=>{
    res.send("hamaya....")
})



app.listen(process.env.PORT ||3600,()=>{
    console.log("server 3600 lo run avutundi ._.")
})