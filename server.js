require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();

const UserModel = require("./model/User.model");
const NoteModel = require("./model/Note.model");
const connectDB = require("./db");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log("MONGO_URI =", process.env.MONGO_URI);

connectDB();

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "YOUR_SECRET_KEY"
        );

        req.user = decoded;

        next();

    }
    catch (err) {

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });

    }

};

app.post("/adduser", async (req, res) => {

    try {

        const { username, password } = req.body;

        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        const newUser = new UserModel({
            username,
            password: hashedPassword
        });

        await newUser.save();

        res.json({
            success: true,
            message: "User registered successfully",
            redirectUrl: "/sign_up_form.html"
        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });

    }

});

app.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await UserModel.findOne({ username });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });

        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "YOUR_SECRET_KEY",
            { expiresIn: "24h" }
        );

        res.json({
            success: true,
            token: token,
            userId: user._id,
            redirectUrl: "/sticky_note.html"
        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });

    }

});

app.post("/addnote", verifyToken, async (req, res) => {

    try {

        const {
            title,
            description,
            userId,
            x,
            y,
            datetime
        } = req.body;

        const newNote = new NoteModel({

            title: title || "New Note",

            description: description || "",

            userId: userId,

            x: x || 100,

            y: y || 100,

            datetime: datetime || new Date()

        });

        const savedNote = await newNote.save();

        res.json({
            success: true,
            note: savedNote
        });

    }
    catch (err) {

        console.error("ADD NOTE ERROR:", err.message);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

app.get("/getnotes/:userId", verifyToken, async (req, res) => {

    try {

        const userId = req.params.userId;

        const notes = await NoteModel
            .find({ userId: userId })
            .sort({ datetime: -1 });

        res.json(notes);

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch notes"
        });

    }

});

app.put("/updatenote", verifyToken, async (req, res) => {

    try {

        const {
            id,
            title,
            description,
            x,
            y,
            datetime
        } = req.body;

        if (!id || id.length !== 24) {

            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });

        }

        const updatedNote = await NoteModel.findByIdAndUpdate(

            id,

            {
                title,
                description,
                x,
                y,
                datetime: datetime || new Date()
            },

            { new: true }

        );

        if (!updatedNote) {

            return res.status(404).json({
                success: false,
                message: "Note not found"
            });

        }

        res.json({
            success: true,
            note: updatedNote
        });

    }
    catch (err) {

        console.error("Update Error:", err.message);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

app.delete("/deletenote/:noteId", verifyToken, async (req, res) => {

    try {

        const noteId = req.params.noteId;

        if (!noteId || noteId.length !== 24) {

            return res.status(400).json({
                success: false,
                message: "Invalid Note ID"
            });

        }

        const deletedNote = await NoteModel.findByIdAndDelete(noteId);

        if (!deletedNote) {

            return res.status(404).json({
                success: false,
                message: "Note not found"
            });

        }

        res.json({
            success: true,
            message: "Note deleted successfully"
        });

    }
    catch (err) {

        console.error("Delete Error:", err.message);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

app.get("/", (req, res) => {

    res.send("hamaya....");

});

const PORT = process.env.PORT || 3600;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
