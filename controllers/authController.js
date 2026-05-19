var UserModel=require("../model/User.model");
const bcrypt = require('bcryptjs');
const jwt=require("jsonwebtoken");


const register=async(req,res)=>{
   var{username,password}=req.body;
   var salt=await bcrypt.genSalt(10);
   var hashedPassword = await bcrypt.hash(password, salt);
   var newUser = new UserModel({
            username,
            password: hashedPassword 
        });
        await newUser.save();
        res.redirect("/sign_up_form.html")

    
};

const login=async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Search for the user
        const user = await UserModel.findOne({ username: username });

        if (!user) {
           return res.status(404).json({ success: false, message: "User not found." });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token=jwt.sign(
                {id:user._id},
                "YOUR_SECRET_KEY",
                {expiresIn:"24h"}
            );
            res.json({
                    success: true,
                    token:token,
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
};

module.exports={register,login};