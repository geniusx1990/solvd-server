const client = require("../configs/database");
const PartService = require('../services/partService');

class PartController {

    async getParts(request, response) {
        try {
            const parts = await PartService.getAllParts();
            response.status(200).json(parts);
        } catch (error) {
            console.error("Error fetching part:", error);
            response.status(500).json({ error: "An error occurred while fetching parts." });
        }
    }

    async createPart(request, response) {
        try {
            const { part_name, description, price, availability, repair_cost, repair_time, vehicle_id } = request.body;
            const newPart = await PartService.createPart(part_name, description, price, availability, repair_cost, repair_time, vehicle_id);
            response.status(201).json(newPart);
        } catch (error) {
            console.error('Error creating part:', error);
            response.status(500).json({ error: 'An error occurred while creating a part.' });
        }
    }

    async getPart(request, response) {
        const partId = request.params.id;
        try {
            const part = await PartService.getPartByID(partId);
            if (part === null) {
                response.status(404).json({ error: "Part not found." });
            } else {
                response.status(200).json(part);
            }
        } catch (error) {
            console.error("Error fetching part:", error);
            response.status(500).json({ error: "An error occurred while fetching the part." });
        }
    }

    async updatePart(request, response) {
        const partData = request.body;
        const { id, part_name, description, price, availability, repair_cost, repair_time, vehicle_id } = partData;
        if (!id) {
            return response.status(400).json({ message: 'ID not specified' });
        }

        try {
            const updatedPart = await PartService.updatePart(id, part_name, description, price, availability, repair_cost, repair_time, vehicle_id);
            if (updatedPart === null) {
                return response.status(404).json({ error: 'Part not found' });
            }
            response.status(200).json(updatedPart);
        } catch (error) {
            return response.status(500).json({ error: 'An error occurred while updating the part' });
        }
    }

    async deletePart(request, response) {
        const partId = request.params.id

        try {
            const deletedPart = await PartService.deletePartById(partId);

            if (deletedPart === null) {
                return response.status(404).json({ error: 'Part not found' });
            }
            response.status(200).json(deletedPart);

        } catch (error) {
            console.error('Error deleting part:', error);
            response.status(500).json({ error: 'An error occurred while deleting the part' });
        }
    }


}

module.exports = new PartController();