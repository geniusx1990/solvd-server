const express = require('express');

const router = express.Router();
const MarkCtonroller = require('../controllers/MarkController');

router.post('/marks', MarkCtonroller.createMark);
router.get('/marks', MarkCtonroller.getMarks);

router.get('/marks/:id', MarkCtonroller.getMark);

router.put('/marks', MarkCtonroller.updateMark);
router.delete('/marks/:id', MarkCtonroller.deleteMark);




module.exports = router;
