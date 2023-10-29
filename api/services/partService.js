const client = require('../configs/database');

class PartService {
    async getAllParts() {
        try {
            const queryResult = await client.query('SELECT * FROM parts ORDER BY id ASC');
            return queryResult.rows;
        } catch (error) {
            console.error('Error fetching parts:', error);
            throw new Error('An error occurred while fetching parts.');
        }
    }

    async createPart(part_name, description, price, availability, repair_cost, repair_time, vehicle_id) {
        try {
            const queryResult = await client.query(
                'INSERT INTO parts (part_name, description, price, availability, repair_cost, repair_time, vehicle_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [part_name, description, price, availability, repair_cost, repair_time, vehicle_id]
            );

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error creating part:', error);
            throw new Error('An error occurred while creating a part.');
        }
    }

    async getPartByID(partId) {
        try {
            const queryResult = await client.query('SELECT * FROM parts WHERE id = $1', [partId]);
            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error("Error fetching part:", error);
            throw new Error('An error occurred while fetching the part.');


        }
    }

    async updatePart(id, part_name, description, price, availability, repair_cost, repair_time, vehicle_id) {
        try {
            const queryResult = await client.query('UPDATE parts SET part_name = $1, description = $2, price = $3, availability = $4, repair_cost = $5, repair_time = $6, vehicle_id = $7 WHERE id = $8 RETURNING *', [part_name, description, price, availability, repair_cost, repair_time, vehicle_id, id]);

            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error updating part:', error);
            throw new Error('An error occurred while updating the part.');
        }
    }

    async deletePartById(partId) {
        try {
            const queryResult = await client.query('DELETE FROM parts WHERE id = $1 RETURNING *', [partId]);

            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error deleting part:', error);
            throw new Error('An error occurred while deleting the part');
        }
    }

    async getPartsForVehicle(mark_id, model, vehicle_year) {
        try {
          const queryResult = await client.query(`
            SELECT *
            FROM parts p
            JOIN vehicle v ON p.vehicle_id = v.id
            WHERE v.mark_id = $1
            AND v.model = $2
            AND v.vehicle_year = $3;`, 
            [mark_id, model, vehicle_year]);
          return queryResult.rows;
        } catch (error) {
          throw error;
        }
      }

}
module.exports = new PartService();
