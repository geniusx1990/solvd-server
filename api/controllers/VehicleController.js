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
        const { mark_id, vehicle_year } = request.body;
        if (!mark_id || !vehicle_year || isNaN(mark_id) || isNaN(vehicle_year)) {
            return response.status(400).json({ error: 'Invalid or missing data in the request' });
        }

        try {
            const newVehicle = await VehicleService.createVehicle(mark_id, vehicle_year);
            if (newVehicle === null) {
                return response.status(409).json({ error: 'Vehicle with the same mark and vehicle_year already exists' });
            }
            response.status(201).json({ message: 'Vehicle created successfully', vehicle: newVehicle });
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
        const { id, mark_id, vehicle_year } = vehicleData;
        if (!id | isNaN(vehicle_year)) {
            return response.status(400).json({ error: 'Invalid or missing data in the request' });
        }

        try {
            const updatedVehicle = await VehicleService.updateVehicle(id, mark_id, vehicle_year);
            
            if (updatedVehicle === false) {
                return response.status(409).json({ error: 'Vehicle with the same mark and vehicle_year already exists' });
            }

            if (updatedVehicle === null) {
                return response.status(404).json({ error: 'Vehicle not found' });
            }

            return response.status(200).json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });
        } catch (error) {
            return response.status(500).json({ error: 'An error occurred while updating the vehicle' });
        }
    }

    async deleteVehicle(request, response) {
        const vehicleId = request.params.id;

        try {
            const deletedVehicle = await VehicleService.deleteVehicleById(vehicleId);

            if (deletedVehicle === null) {
                return response.status(404).json({ error: 'Vehicle not found' });
            }

            return response.status(200).json({ message: 'Vehicle deleted successfully', vehicle: deletedVehicle });

        } catch (error) {
            console.error('Error deleting vehicle:', error);
            return response.status(500).json({ error: 'An error occurred while deleting the vehicle' });
        }
    }

}

module.exports = new VehicleContoller();