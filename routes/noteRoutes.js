const express = require('express');
const router = express.Router();
const { addNotes,getNotes,updateNotes,deleteNotes } = require('../controllers/noteController');
const protect = require('../middleware/authMiddleware');

router.get('/',protect, getNotes);
router.post('/',protect, addNotes);
router.put('/:id', protect,updateNotes);
router.delete('/:id', protect,deleteNotes);

module.exports = router;