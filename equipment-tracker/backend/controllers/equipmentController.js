const Equipment = require('../models/Equipment');

exports.getAllEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find();
        res.json(equipment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createEquipment = async (req, res) => {
    const { name, type, status, lastCleanedDate } = req.body;

    if (!name || !type || !status) {
        return res.status(400).json({ message: 'Name, Type, and Status are required.' });
    }

    const newItem = new Equipment({
        name,
        type,
        status,
        lastCleanedDate: lastCleanedDate || null
    });

    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateEquipment = async (req, res) => {
    const { id } = req.params;
    const { name, type, status, lastCleanedDate } = req.body;

    try {
        const updatedItem = await Equipment.findByIdAndUpdate(
            id,
            {
                name,
                type,
                status,
                lastCleanedDate
            },
            { new: true } // Return the updated document
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteEquipment = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedItem = await Equipment.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        res.json({ message: 'Equipment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
