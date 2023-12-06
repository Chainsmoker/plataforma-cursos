const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const flash = require('express-flash');

const passport = require('passport');

const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');

router.use(flash());

router.get('/', async (req, res) => {
    if (!req.isAuthenticated()){
        return res.redirect('/my-account/login')
    }

    const userData = {
        name: req.user.name,
        email: req.user.email,
    }

    const coursesViewedIds = req.user.coursesViewed;
    const findCourses = await Course.find({ _id: { $in: coursesViewedIds.map(viewed => viewed.courseId) } }).lean();

    const courseInfoMap = findCourses.reduce((acc, course) => {
        acc[course._id] = course;
        return acc;
    }, {});

    let coursesViewed = coursesViewedIds.map(viewed => ({
        ...courseInfoMap[viewed.courseId],
        lessonId: viewed.lessonId
    }));

    coursesViewed = coursesViewed.slice().reverse();

    try {
        res.render('pages/user/my-account', { pageTitle: 'Mi cuenta', userData, coursesViewed });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/edit-profile', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/my-account/login');
    }

    const { name, email } = req.body;

    try {
        await User.findByIdAndUpdate(req.user._id, { name, email });

        res.redirect('/my-account');
    } catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            const errorMessage = 'El correo electrónico ingresado ya está en uso. Por favor, elige otro correo electrónico.';
        
            return res.redirect(`/my-account?error=${encodeURIComponent(errorMessage)}`);
        }

        console.error('Error al actualizar los datos del usuario', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/register', (req, res) => {
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    res.render('pages/user/register', {pageTitle: 'Registrarse', active: 'register'});
});

router.post('/register', [
    check('name').not().isEmpty().withMessage('Ingresa un nombre válido'),
    check('email').isEmail().withMessage('Ingresa un e-mail válido'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.errors[0].msg;
        return res.render('pages/user/register', { errors: firstError });
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.render('pages/user/register', { errors: 'Este correo electrónico ya está en uso.' });
        }

        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;

        const user = await newUser.save();
        req.flash('success_msg', 'Registro exitoso, puedes iniciar sesión ahora.');
        res.redirect('/my-account/login');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/login', (req, res) => {
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    const messages = req.flash();
    res.render('pages/user/login', {pageTitle: 'Iniciar Sesion', active: 'login', messages});
});

router.post('/login', (req, res, next) => {
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/my-account/login',
        failureFlash: true,
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
            res.redirect('/');
    });
});

module.exports = router;