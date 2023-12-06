const express =  require('express');
const tema_model =  require('../models/Tema');
const router = express.Router();

/**
 * @swagger
 * /api/temas:
 *   get:
 *     summary: Obtener todos los temas.
 *     responses:
 *       '200':
 *         description: Lista de temas obtenida exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               - name: Tema 1
 *                 description: Descripción del tema 1.
 *                 lessons: 10
 *               - name: Tema 2
 *                 description: Descripción del tema 2.
 *                 lessons: 8
 */


/**
 * @swagger
 * /api/tema:
 *   post:
 *     summary: Crear un nuevo tema.
 *     requestBody:
 *       description: Objeto del tema a crear.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del tema.
 *               description:
 *                 type: string
 *                 description: Descripción del tema.
 *               lessons:
 *                 type: number
 *                 description: Número de lecciones del tema.
 *     responses:
 *       '200':
 *         description: Tema creado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               name: Nuevo Tema
 *               description: Descripción del nuevo tema.
 *               lessons: 12
 */

/**
 * @swagger
 * /api/tema/{id}:
 *   get:
 *     summary: Obtener un tema por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del tema a recuperar.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tema obtenido exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               name: Tema Recuperado
 *               description: Descripción del tema recuperado.
 *               lessons: 15
 */

/**
 * @swagger
 * /api/tema/{id}:
 *   put:
 *     summary: Actualizar un tema por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del tema a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Objeto del tema actualizado.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del tema.
 *               description:
 *                 type: string
 *                 description: Nueva descripción del tema.
 *               lessons:
 *                 type: number
 *                 description: Nuevo número de lecciones del tema.
 *     responses:
 *       '200':
 *         description: Tema actualizado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               name: Tema Actualizado
 *               description: Nueva descripción del tema.
 *               lessons: 18
 */

/**
 * @swagger
 * /api/tema/{id}:
 *   delete:
 *     summary: Eliminar un tema por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del tema a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tema eliminado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               message: Tema eliminado con éxito.
 */

//Obtener temas
router.get('/temas',(req, res)=>{
    tema_model
        .find()
        .then((data)=> res.json(data))
        .catch((error)=> res.json({message:error}));
});

//Crear un nuevo tema
router.post('/tema',(req, res)=>{
    const tema = tema_model(req.body);
    tema
        .save()
        .then((data)=> res.json(data))
        .catch((error)=> res.json({message:error}));
});

//Recuperar un tema por ID
router.get('/tema/:id',(req, res)=>{
    const { id } = req.params;
    tema_model
        .findById(id)
        .then((data)=> res.json(data))
        .catch((error)=> res.json({message:error}));
});

//Actualizar un tema
router.put('/tema/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, lessons } = req.body;

    tema_model
        .updateOne({ _id: id }, { name, description, lessons })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Eliminar un tema
router.delete('/tema/:id',(req, res)=>{
    const { id } = req.params;
    tema_model
        .deleteOne({ _id: id })
        .then((data)=> res.json(data))
        .catch((error)=> res.json({message:error}));
});

module.exports = router;