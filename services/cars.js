const fs = require('fs/promises');
const { options } = require('nodemon/lib/config');
const Car = require('../models/Car');

const filePath = './services/data.json'

async function read() {
    try {
        const file = await fs.readFile(filePath);
        return JSON.parse(file);

    } catch (err) {
        console.error('Database read error');
        console.error(err);
        process.exit(1);
    }
}

async function write(data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Database write error');
        console.error(err);
        process.exit(1);
    }
}

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
    const data = await read();

    if (data.hasOwnProperty(id)) {
        delete data[id];
        await write(data);
    } else {
        throw new ReferenceError('No such ID in database');
    }

}

async function editById(id, car) {
    const data = await read();

    if (data.hasOwnProperty(id)) {
        data[id] = car;
        await write(data);
    } else {
        throw new ReferenceError('No such ID in database');
    }

}

async function createCar(car) {
    const result = new Car(car);
    await result.save();
}

function nextId() {
    return 'xxxxxxxx-xxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16));
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