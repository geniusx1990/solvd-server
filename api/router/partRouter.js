const express = require('express');

const router = express.Router();
const PartController = require('../controllers/PartController');

router.post('/parts', PartController.createPart);
router.get('/parts', PartController.getParts);
router.get('/parts/:id', PartController.getPart);
router.put('/parts', PartController.updatePart);
router.delete('/parts/:id', PartController.deletePart);

module.exports = router;
