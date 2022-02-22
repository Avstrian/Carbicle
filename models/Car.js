const { Schema, model, Types } = require('mongoose');

const carSchema = new Schema({
    name: { type: String, required: true, minlength: [3, 'Car listing name must be at least 3 characters long'] },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '', match: [/^https?:\/\//, 'Image URL must be a valid URL'] },
    price: { type: Number, min: 0, required: true },
    accessories: { type: [Types.ObjectId], default: [], ref: 'Accessory' },
    isDeleted: { type: Boolean, default: false },
    owner: { type: Types.ObjectId, ref: 'User' }
});

const Car = model('Car', carSchema);

module.exports = Car;