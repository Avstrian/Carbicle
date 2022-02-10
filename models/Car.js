const { Schema, model } = require('mongoose');

const carSchema = new Schema({
    name: { type: String, required: true, minlength: 3 },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    price: { type: Number, min: 0, required: true }
});

const Car = model('Car', carSchema);

module.exports = Car;