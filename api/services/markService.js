const client = require('../configs/database');

class MarkService {
    async getAllMarks() {
        try {
            const queryResult = await client.query('SELECT * FROM marks ORDER BY id ASC');
            return queryResult.rows;

        } catch (error) {
            console.error('Error fetching marks:', error);
            throw new Error('An error occurred while fetching marks.');
        }
    }

    async createMark(mark) {
        try {
            const queryResult = await client.query(
                'INSERT INTO marks (mark) VALUES ($1) RETURNING *', [mark]
            );
            return queryResult.rows[0];
        } catch (error) {
            console.error('Error creating mark:', error);
            throw new Error('An error occurred while creating mark.');
        }
    }

    async getMarkById(markId) {
        try {
            const queryResult = await client.query('SELECT * FROM marks WHERE id = $1', [markId]);
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
            const queryResult = await client.query('UPDATE marks SET mark = $1 WHERE id = $2 RETURNING *', [mark, id]);

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
            const queryResult = await client.query('DELETE FROM marks WHERE id = $1 RETURNING *', [markId]);

            if (queryResult.rows.length === 0) {
                return null;
            }

            return queryResult.rows[0];
        } catch (error) {
            console.error('Error deleting mark:', error);
            throw new Error('An error occurred while deleting the mark');
        }
    }

    async markExist(mark) {
        try {
            const queryResult = await client.query('SELECT COUNT(*) FROM marks WHERE mark = $1', [mark]);
            return queryResult.rows[0].count > 0;
        } catch (error) {
            console.log('Error checking if mark exist:', error);
            throw new Error('An error occured while checking if the mark exist');
        }
    }



}

module.exports = new MarkService();