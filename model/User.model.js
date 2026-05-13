var mongoose=require("mongoose");
const {v4:uuidv4}=require('uuid');
var UserSchema=mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        default: uuidv4, // Generates a unique ID like '1b9d6bcd...' automatically
        unique: true
    }
});
var UserModel = mongoose.model('User', UserSchema);
module.exports=UserModel;