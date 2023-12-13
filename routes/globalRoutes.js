const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().sort({ created_at: -1 }).lean();
        res.render('pages/home', { pageTitle: 'Inicio', courses }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/support', async (req, res) => {
    try {
        res.render('pages/support', { pageTitle: 'Soporte', active: 'support' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/about', async (req, res) => {
    try {
        res.render('pages/about', { pageTitle: 'Sobre nosotros', active: 'about' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;