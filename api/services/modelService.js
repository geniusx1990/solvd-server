const client = require('../configs/database');

class ModelService {
    async getAllModels() {
        try {
            const queryResult = await client.query('SELECT * FROM models ORDER BY id ASC');
            return queryResult.rows;
        } catch (error) {
            console.error('Error fetching models:', error);
            throw new Error('An error occurred while fetching models.');
        }
    }
 
    async createModel(model) {
        try {
            const queryResult = await client.query(
                'INSERT INTO models (model) VALUES ($1) RETURNING *',
                [model]
            );

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error creating model:', error);
            throw new Error('An error occurred while creating a model.');
        }
    }

     async getModelById(modelId) {
        try {
            const queryResult = await client.query('SELECT * FROM models WHERE id = $1', [modelId]);
            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error("Error fetching model:", error);
            throw new Error('An error occurred while fetching the model.');


        }
    }

    async updateModel(id, model) {
        try {
            const queryResult = await client.query('UPDATE models SET model = $1 WHERE id = $2 RETURNING *', [model, id]);
    
            if (queryResult.rows.length === 0) {
                return null;
            }
    
            return queryResult.rows[0];
        } catch (error) {
            console.error('Error updating model:', error);
            throw new Error('An error occurred while updating the model.');
        }
    }
 
    async deleteModelById(modelId) {
        try {
            const queryResult = await client.query('DELETE FROM models WHERE id = $1 RETURNING *', [modelId]);

            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error deleting model:', error);
            throw new Error('An error occurred while deleting the model');
        }
    }

   



}
module.exports = new ModelService();
