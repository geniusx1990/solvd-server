const MarkService = require('../services/markService');

class MarkCtonroller {

    async getMarks(request, response) {
        try {
            const marks = await MarkService.getAllMarks();
            response.status(200).json(marks);
        } catch (error) {
            console.error("Error fetching marks:", error);
            response.status(500).json({ error: "An error occurred while fetching marks." });
        }
    }

    async createMark(request, response) {
        const { mark } = request.body;
        if (!mark) {
            response.status(400).json({ error: 'Invalid input: mark is required' });
            return;
        }

        try {
            const existingMark = await MarkService.markExist(mark);
            if (existingMark) {
                response.status(409).json({ error: 'Mark already exists' });
                return;
            }

            const newMark = await MarkService.createMark(mark);
            response.status(201).json({ mark: newMark, message: 'Mark created successfully' });
        } catch (error) {
            console.error('Error creating mark:', error);
            response.status(500).json({ error: 'An error occurred while creating a mark.' });
        }
    }

    async getMark(request, response) {
        const markId = request.params.id;
        try {
            const mark = await MarkService.getMarkById(markId);
            if (mark === null) {
                response.status(404).json({ error: "Mark not found." });
            } else {
                response.status(200).json(mark);
            }
        } catch (error) {
            console.error("Error fetching mark:", error);
            response.status(500).json({ error: "An error occurred while fetching the mark." });
        }
    }

    async updateMark(request, response) {
        const markData = request.body;
        const { id, mark } = markData;
        if (!id) {
            return response.status(400).json({ message: 'ID not specified' });
        }

        try {
            const updatedMark = await MarkService.updateMark(id, mark);
            if (updatedMark === null) {
                return response.status(404).json({ error: 'Mark not found' });
            }
            return response.status(200).json({ message: 'Mark updated successfully', updatedMark });
        } catch (error) {
            return response.status(500).json({ error: 'An error occurred while updating the mark' });
        }
    }

    async deleteMark(request, response) {
        const markId = request.params.id

        try {
            const deletedMark = await MarkService.deleteMarkById(markId);

            if (deletedMark === null) {
                return response.status(404).json({ error: 'Mark not found' });
            }
            return response.status(200).json({ message: 'Mark deleted successfully', deletedMark });

        } catch (error) {
            console.error('Error deleting mark:', error);
            response.status(500).json({ error: 'An error occurred while deleting the mark' });
        }
    }


}

module.exports = new MarkCtonroller();