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
    },
    x: { 
        type: Number, 
        default: 100 
    },
    y: { 
        type: Number, 
        default: 100 
    } 
 }, {
        timestamps:true
    
});

var NoteModel=mongoose.model('Note',NoteSchema);
module.exports=NoteModel;
