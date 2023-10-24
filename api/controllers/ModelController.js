const client = require("../configs/database");
const ModelService = require('../services/modelService');

class ModelController {

    async getModels(request, response) {
        try {
            const models = await ModelService.getAllModels();
            response.status(200).json(models);
        } catch (error) {
            console.error("Error fetching models:", error);
            response.status(500).json({ error: "An error occurred while fetching models." });
        }
    }

    async createModel(request, response) {
        try {
            const { model } = request.body;
            if (!model || typeof model !== 'string') {
                return response.status(400).json({ error: 'Invalid or missing model data' });
            }
            const newModel = await ModelService.createModel(model);
            response.status(201).json({ message: 'Model created successfully', model: newModel });
        } catch (error) {
            console.error('Error creating model:', error);
            response.status(500).json({ error: 'An error occurred while creating a model.' });
        }
    }

    async getModel(request, response) {
        const modelId = request.params.id;
        try {
            const model = await ModelService.getModelById(modelId);
            if (model === null) {
                response.status(404).json({ error: "Model not found." });
            } else {
                response.status(200).json(model);
            }
        } catch (error) {
            console.error("Error fetching model:", error);
            response.status(500).json({ error: "An error occurred while fetching the model." });
        }
    }

    async updateModel(request, response) {
        const modelData = request.body;
        const { id, model } = modelData;
        if (!id) {
            return response.status(400).json({ message: 'ID not specified' });
        }

        try {
            const updatedModel = await ModelService.updateModel(id, model);
            if (updatedModel === null) {
                return response.status(404).json({ error: 'Model not found' });
            }
            return response.status(200).json({ message: 'Model updated successfully', updatedModel });
        } catch (error) {
            return response.status(500).json({ error: 'An error occurred while updating the model' });
        }
    }

    async deleteModel(request, response) {
        const modelId = request.params.id

        try {
            const deletedModel = await ModelService.deleteModelById(modelId);

            if (deletedModel === null) {
                return response.status(404).json({ error: 'Model not found' });
            }
            response.status(200).json(deletedModel);

        } catch (error) {
            console.error('Error deleting model:', error);
            response.status(500).json({ error: 'An error occurred while deleting the model' });
        }
    }


}

module.exports = new ModelController();