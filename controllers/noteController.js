var NoteModel=require("../model/Note.model");

const addNotes= async (req, res) => {
    try {
        const { title, description, dateTime } = req.body;
        
        const newNote = new NoteModel({
            title: title || "New Note",
            description: description,
            userId: req.user.id,
            x: 100,
            y: 100,
            dateTime:dateTime
        });

        const savedNote = await newNote.save();
        res.json({ success: true, note: savedNote });
    } catch (err) {
        console.error("ADD NOTE ERROR:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};


const getNotes=async(req,res)=>{
  try{
    
    var notes=await NoteModel.find({userId:req.user.id}).sort({createdAt:-1});
    res.json(notes);
  }catch(err){
        res.status(500).json({error:"failed to fetch notes"});
  }
};

const updateNotes= async (req, res) => {
    try {
        const { id, title, description, x, y } = req.body;

        
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
};

const deleteNotes=async(req,res)=>{
    try {
        const noteId = req.params.id;

        
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
};

module.exports={addNotes,getNotes,updateNotes,deleteNotes};
