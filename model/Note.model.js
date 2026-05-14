var mongoose=require("mongoose");

var NoteSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description: {
        type: String,
        required: false,
        default:""
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    } 
 }, {
        timestamps:true
    
});

var NoteModel=mongoose.model('Note',NoteSchema);
module.exports=NoteModel;
