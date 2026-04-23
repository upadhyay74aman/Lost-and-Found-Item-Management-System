const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    ItemName: { type: String, required: true },
    Description: { type: String },
    Type: { type: String, enum: ['Lost', 'Found'], required: true },
    Location: { type: String },
    Date: { type: Date, default: Date.now },
    ContactInfo: { type: String, required: true }
});

module.exports = mongoose.model('Item', itemSchema);
