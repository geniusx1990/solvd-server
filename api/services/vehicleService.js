const client = require('../configs/database');

class VehicleService {
    async getAllVehicles() {
        try {
            const queryResult = await client.query('SELECT * FROM vehicle ORDER BY id ASC');
            return queryResult.rows;

        } catch (error) {
            console.error('Error fetching vehicles:', error);
            throw new Error('An error occurred while fetching vehicles.');
        }
    }

    async createVehicle(mark_id, model_id, vehicle_year) {
        try {
            const queryResult = await client.query(
                'INSERT INTO vehicle (mark_id, model_id, vehicle_year) VALUES ($1, $2, $3) RETURNING *',
                [mark_id, model_id, vehicle_year]
            );
            return queryResult.rows[0];
        } catch (error) {
            console.error('Error creating vehicle:', error);
            throw new Error('An error occurred while creating vehicle.');
        }
    }

    async getVehicleById(vehicleId) {
        try {
            const queryResult = await client.query('SELECT * FROM vehicle WHERE id = $1', [vehicleId]);
            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error("Error fetching vehicle:", error);
            throw new Error('An error occurred while fetching the vehicle.');

        }
    }


    async updateVehicle(id, mark_id, model_id, vehicle_year) {
        try {
            const queryResult = await client.query('UPDATE vehicle SET mark_id = $1, model_id = $2, vehicle_year = $3 WHERE id = $4 RETURNING *', [mark_id, model_id, vehicle_year, id]);

            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error updating vehicle:', error);
            throw new Error('An error occurred while updating the vehicle.');
        }
    }


    async deleteVehicleById(vehicleId) {
        try {
            const queryResult = await client.query('DELETE FROM vehicle WHERE id = $1 RETURNING *', [vehicleId]);

            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            throw new Error('An error occurred while deleting the vehicle');
        }
    }

    async getVehicleDetailsById(vehicleId) {
        try {
            const query = `
            SELECT 
            vehicle.id as vehicle_id,
            vehicle.mark_id, 
            vehicle.model_id,
            vehicle.vehicle_year,
            marks.mark AS mark_name,
            models.model AS model_name
            FROM vehicle
            LEFT JOIN marks ON vehicle.mark_id = marks.id
            LEFT JOIN models ON vehicle.model_id = models.id
            WHERE vehicle.id = $1;
            `;
            const queryResult = await client.query(query, [vehicleId]);
            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error fetching vehicle with details:', error);
            throw new Error('An error occurred while fetching the vehicle with details.');
        }
    }



}

module.exports = new VehicleService();