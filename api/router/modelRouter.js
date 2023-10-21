const express = require('express');

const router = express.Router();
const ModelController = require('../controllers/ModelController');

router.post('/models', ModelController.createModel);
router.get('/models', ModelController.getModels);
router.get('/models/:id', ModelController.getModel);
router.put('/models', ModelController.updateModel);
router.delete('/models/:id', ModelController.deleteModel);

module.exports = router;
