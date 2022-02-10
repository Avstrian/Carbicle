const { options } = require('nodemon/lib/config');
const Car = require('../models/Car');

function carViewModel(car) {
    return {
        id: car._id,
        name: car.name,
        description: car.description,
        imageUrl: car.imageUrl,
        price: car.price
    }
}

async function getAll(query) {
    const options = {};

    if (query.search) {
        options.name = new RegExp(query.search, 'i');
    }
    if (query.from) {
        options.price = { $gte: Number(query.from) };
    }
    if (query.to) {
        if (!options.price) {
            options.price = {};
        }
        options.price.$lte = Number(query.to);
    }

    const cars = await Car.find(options);

    return cars.map(carViewModel);
}

async function getById(id) {
    const car = await Car.findById(id);

    if (car) {
        return carViewModel(car);
    } else {
        return undefined;
    }
}

async function deleteById(id) {
    await Car.findByIdAndDelete(id);
}

async function editById(id, car) {
    const existing = await Car.findById(id);
    existing.name = car.name;
    existing.description = car.description;
    existing.imageUrl = car.imageUrl;
    existing.price = car.price;

    await existing.save();
}

async function createCar(car) {
    const result = new Car(car);
    await result.save();
}

module.exports = () => (req, res, next) => {
    req.storage = {
        getAll,
        getById,
        deleteById,
        editById,
        createCar
    };
    next();
}