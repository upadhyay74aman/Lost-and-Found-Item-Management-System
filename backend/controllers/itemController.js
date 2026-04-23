const Item = require('../models/Item');

exports.addItem = async (req, res) => {
    try {
        const item = await Item.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (item) {
            const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.searchItems = async (req, res) => {
    try {
        const { name } = req.query;
        const items = await Item.find({ ItemName: { $regex: name, $options: 'i' } });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
