const client = require('../configs/database');

class MarkService {
    async getAllMarks() {
        try {
            const queryResult = await client.query('SELECT * FROM mark ORDER BY id ASC');
            return queryResult.rows;

        } catch (error) {
            console.error('Error fetching marks:', error);
            throw new Error('An error occurred while fetching marks.');
        }
    }

    async createMark(mark) {
        try {
            const queryResult = await client.query(
                'INSERT INTO mark (mark) VALUES ($1) RETURNING *', [mark]
            );
            return queryResult.rows[0];
        } catch (error) {
            console.error('Error creating mark:', error);
            throw new Error('An error occurred while creating mark.');
        }
    }

    async getMarkById(markId) {
        try {
            const queryResult = await client.query('SELECT * FROM mark WHERE id = $1', [markId]);
            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error("Error fetching mark:", error);
            throw new Error('An error occurred while fetching the mark.');

        }
    }


    async updateMark(id, mark) {
        try {
            const queryResult = await client.query('UPDATE mark SET mark = $1 WHERE id = $2 RETURNING *', [mark, id]);
    
            if (queryResult.rows.length === 0) {
                return null;
            }
    
            return queryResult.rows[0];
        } catch (error) {
            console.error('Error updating mark:', error);
            throw new Error('An error occurred while updating the mark.');
        }
    }

    
    async deleteMarkById(markId) {
        try {
            const queryResult = await client.query('DELETE FROM mark WHERE id = $1 RETURNING *', [markId]);

            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error deleting mark:', error);
            throw new Error('An error occurred while deleting the mark');
        }
    }



}

module.exports = new MarkService();