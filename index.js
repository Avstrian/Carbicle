const express = require('express');
const hbs = require('express-handlebars');
const session = require('express-session')

const initDb = require('./models/index');

const carsService = require('./services/cars');
const accessoryService = require('./services/accessory');
const authService = require('./services/auth');
const { isLoggedIn } = require('./services/util');

const { about } = require('./controllers/about');
const { details } = require('./controllers/details');
const { home } = require('./controllers/home');
const { notFound } = require('./controllers/notFound');
const create = require('./controllers/create');
const deleteCar = require('./controllers/remove');
const editCar = require('./controllers/edit');
const accessory = require('./controllers/accessory');
const attach = require('./controllers/attach');
const { registerPost, registerGet, loginGet, loginPost, logout } = require('./controllers/auth');

const { body } = require('express-validator');

start();

async function start() {
    await initDb();

    const app = express();

    app.engine('hbs', hbs.create({
        extname: '.hbs'
    }).engine);
    app.set('view engine', 'hbs');

    app.use(session({
        secret: 'my super duper secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: 'auto' }
    }));
    app.use(express.urlencoded({ extended: true }));
    app.use('/static', express.static('static'));
    app.use(carsService());
    app.use(accessoryService());
    app.use(authService());

    app.get('/', home);
    app.get('/about', about);
    app.get('/details/:id', details);

    app.route('/create')
        .get(isLoggedIn(), create.get)
        .post(isLoggedIn(), create.post);

    app.route('/remove/:id')
        .get(isLoggedIn(), deleteCar.get)
        .post(isLoggedIn(), deleteCar.post);

    app.route('/edit/:id')
        .get(isLoggedIn(), editCar.get)
        .post(isLoggedIn(), editCar.post);

    app.route('/accessory')
        .get(isLoggedIn(), accessory.get)
        .post(isLoggedIn(), accessory.post);

    app.route('/attach/:id')
        .get(isLoggedIn(), attach.get)
        .post(isLoggedIn(), attach.post);

    app.route('/register')
        .get(registerGet)
        .post(
            body('username')
                .trim()
                .isLength({ min: 3 }).withMessage('Username too short').bail()
                .isAlphanumeric().withMessage('Username can contain only letters and number'),
            body('password')
                .trim()
                .notEmpty().withMessage('Password is required')
                .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
            body('repeatPassword')
                .trim()
                .custom((value, { req }) => value == req.body.password).withMessage('Passwords do not match'),

            registerPost);

    app.route('/login')
        .get(loginGet)
        .post(loginPost);

    app.get('/logout', logout);

    app.all('*', notFound);

    app.listen(3000, () => console.log('server started on port 3000'));
}
