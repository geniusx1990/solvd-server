const express = require('express');

const router = express.Router();
const VehicleController = require('../controllers/VehicleController');

router.post('/vehicles', VehicleController.createVehicle);
router.get('/vehicles', VehicleController.getVehicles);
router.get('/vehicles/:id', VehicleController.getVehicle);
router.put('/vehicles', VehicleController.updateVehicle);
router.delete('/vehicles/:id', VehicleController.deleteVehicle);

module.exports = router;
