const { Schema, model, Types } = require('mongoose');

const accessorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: 'noImage.jpg' },
    price: { type: Number, min: 0 },
    owner: {type: Types.ObjectId, ref: 'User'}
})

const Accessory = model('Accessory', accessorySchema);

module.exports = Accessory;