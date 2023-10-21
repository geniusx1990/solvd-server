const VehicleService = require('../services/vehicleService');

class VehicleContoller {

    async getVehicles(request, response) {
        try {
            const vehicles = await VehicleService.getAllVehicles();
            response.status(200).json(vehicles);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            response.status(500).json({ error: "An error occurred while fetching vehicles." });
        }
    }

    async createVehicle(request, response) {
        try {
            const { mark_id, model_id, vehicle_year } = request.body;
            const newVehicle = await VehicleService.createVehicle(mark_id, model_id, vehicle_year);
            response.status(201).json(newVehicle);
        } catch (error) {
            console.error('Error creating vehicle:', error);
            response.status(500).json({ error: 'An error occurred while creating a vehicle.' });
        }
    }

    async getVehicle(request, response) {
        const vehicleId = request.params.id;
        try {
            const vehicle = await VehicleService.getVehicleById(vehicleId);
            if (vehicle === null) {
                response.status(404).json({ error: "Vehicle not found." });
            } else {
                response.status(200).json(vehicle);
            }
        } catch (error) {
            console.error("Error fetching vehicle:", error);
            response.status(500).json({ error: "An error occurred while fetching the vehicle." });
        }
    }

    async updateVehicle(request, response) {
        const vehicleData = request.body;
        const { id, mark_id, model_id, vehicle_year } = vehicleData;
        if (!id) {
            return response.status(400).json({ message: 'ID not specified' });
        }

        try {
            const vehicleData = await VehicleService.updateVehicle(id, mark_id, model_id, vehicle_year);
            if (vehicleData === null) {
                return response.status(404).json({ error: 'Vehicle not found' });
            }
            response.status(200).json(vehicleData);
        } catch (error) {
            return response.status(500).json({ error: 'An error occurred while updating the vehicle' });
        }
    }

    async deleteVehicle(request, response) {
        const modelId = request.params.id

        try {
            const deleteVehicle = await VehicleService.deleteVehicleById(modelId);

            if (deleteVehicle === null) {
                return response.status(404).json({ error: 'Vehicle not found' });
            }
            response.status(200).json(deleteVehicle);

        } catch (error) {
            console.error('Error deleting vehicle:', error);
            response.status(500).json({ error: 'An error occurred while deleting the vehicle' });
        }
    }


}

module.exports = new VehicleContoller();