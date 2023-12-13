const express =  require('express');
const user_model =  require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Crear un nuevo usuario.
 *     requestBody:
 *       description: Objeto del usuario a crear.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario.
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *     responses:
 *       '200':
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               name: Nuevo Usuario
 *               email: nuevo@usuario.com
 *               password: [hashed password]
 */

//Crear un nuevo user
router.post('/user', async (req, res)=>{
    const user = user_model(req.body);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    user
        .save()
        .then((data)=> res.json(data))
        .catch((error)=> res.json({message:error}));
});

/**
 * @swagger
 * /api/check_user:
 *   post:
 *     summary: Verificar un usuario por correo y contraseña.
 *     requestBody:
 *       description: Objeto con correo y contraseña para verificar el usuario.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *     responses:
 *       '200':
 *         description: Usuario verificado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               name: Usuario Verificado
 *               email: verificado@usuario.com
 */


//Recuperar un user por correo
router.post('/check_user', async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailLowerCase = email.toLowerCase();

        const user = await user_model.findOne({ email: emailLowerCase });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                res.json(user);
            } else {
                res.json(null);
            }
        } else {
            res.json(null);
        }
    } catch (error) {
        res.json({ message: 'Cuenta inválida' });
    }
});

/**
 * @swagger
 * /api/update_user:
 *   put:
 *     summary: Actualizar un usuario.
 *     requestBody:
 *       description: Objeto con datos para actualizar el usuario.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del usuario.
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               new_email:
 *                 type: string
 *                 description: Nuevo correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña actual del usuario.
 *               new_password:
 *                 type: string
 *                 description: Nueva contraseña del usuario.
 *               coursesViewed:
 *                 type: array
 *                 description: Lista de cursos vistos por el usuario.
 *     responses:
 *       '200':
 *         description: Usuario actualizado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               name: Usuario Actualizado
 *               email: actualizado@usuario.com
 */

//Actualizar un user
router.put('/update_user/', async (req, res) => {
    const { name, email, new_email, password, new_password, coursesViewed } = req.body;

    try {
        const user = await user_model.findOne({ email: email.toLowerCase() });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const updatedUser = await user_model.updateOne(
                    { _id: user._id },
                    { name, email: new_email, password: new_password, coursesViewed }
                );

                res.json(updatedUser);
            } else {
                res.json(null);
            }
        } else {
            res.json(null);
        }
    } catch (error) {
        res.json({ message: error.message });
    }
});

module.exports = router;
