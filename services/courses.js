const express =  require('express');
const course_model =  require('../models/Course');
const router = express.Router();


/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Obtener todos los cursos.
 *     responses:
 *       '200':
 *         description: Lista de todos los cursos.
 *         content:
 *           application/json:
 *             example:
 *               - nombre: Curso 1
 *                 nivel: Nivel 1
 *                 duracion: 10
 *                 descripcion: Descripción del curso 1
 *               - nombre: Curso 2
 *                 nivel: Nivel 2
 *                 duracion: 15
 *                 descripcion: Descripción del curso 2
 */

//Obtener cursos
router.get('/courses',(req, res)=>{
    course_model
        .find()
        .then((data)=> res.json(data))
        .catch((error)=> res.json({message:error}));
});

/**
 * @swagger
 * /api/course:
 *   post:
 *     summary: Crear un nuevo curso.
 *     requestBody:
 *       description: Objeto del curso a crear.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del curso.
 *               nivel:
 *                 type: string
 *                 description: Nivel del curso.
 *               duracion:
 *                 type: number
 *                 description: Duración del curso en minutos.
 *               lema:
 *                 type: string
 *                 description: Lema del curso.
 *               descripcion:
 *                 type: string
 *                 description: Descripción del curso.
 *               resultado:
 *                 type: string
 *                 description: Resultado del curso.
 *               slug:
 *                 type: string
 *                 description: Slug único del curso.
 *               recursos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de URLs de recursos relacionados.
 *               temario:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ID del tema relacionado.
 *               presentacion:
 *                 type: string
 *                 description: Presentación del curso.
 *               courseForYou:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     icon:
 *                       type: string
 *                       description: Icono para el curso.
 *                     title:
 *                       type: string
 *                       description: Título relacionado con el curso.
 *                     description:
 *                       type: string
 *                       description: Descripción relacionada con el curso.
 *                 description: Lista de objetos relacionados con el curso.
 *               utilities:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     icon:
 *                       type: string
 *                       description: Icono para las utilidades del curso.
 *                     title:
 *                       type: string
 *                       description: Título de la utilidad.
 *                     description:
 *                       type: string
 *                       description: Descripción de la utilidad.
 *                     link:
 *                       type: string
 *                       description: Enlace relacionado con la utilidad.
 *                 description: Lista de objetos relacionados con las utilidades del curso.
 *     responses:
 *       '200':
 *         description: Curso creado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               nombre: Nuevo Curso
 *               nivel: Nivel Nuevo
 *               duracion: 20
 *               descripcion: Descripción del nuevo curso
 */
//Crear un nuevo curso
router.post('/course',(req, res)=>{
    const course = course_model(req.body);
    course
        .save()
        .then((data)=> res.json(data))
        .catch((error)=> res.json({message:error}));
});

/**
 * @swagger
 * /api/course/{id}:
 *   get:
 *     summary: Obtener un curso por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso a obtener.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Curso encontrado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               nombre: Curso Existente
 *               nivel: Nivel Existente
 *               duracion: 15
 *               descripcion: Descripción del curso existente
 *       '404':
 *         description: Curso no encontrado.
 */

//Recuperar un curso por ID
router.get('/course/:id',(req, res)=>{
    const { id } = req.params;
    course_model
        .findById(id)
        .then((data)=> res.json(data))
        .catch((error)=> res.json({message:error}));
});

/**
 * @swagger
 * /api/course/{id}:
 *   put:
 *     summary: Actualizar un curso por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso a actualizar.
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       description: Objeto del curso actualizado.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       '200':
 *         description: Curso actualizado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               nombre: Curso Actualizado
 *               nivel: Nivel Actualizado
 *               duracion: 25
 *               descripcion: Descripción del curso actualizado
 *       '404':
 *         description: Curso no encontrado.
 */
//Actualizar un curso
router.put('/course/:id',(req, res)=>{
    const { id } = req.params;
    const { nombre, nivel, duracion, descripcion, resultado, slug, recursos, temario, presentacion, lema, courseForYou, utilities,  img } = req.body;
    course_model
    .updateOne({ _id: id }, { nombre, nivel, duracion, descripcion, resultado, slug, recursos, temario, presentacion, lema, courseForYou, utilities, img })
        .then((data)=> res.json(data))
        .catch((error)=> res.json({message:error}));
});

/**
 * @swagger
 * /api/course/{id}:
 *   delete:
 *     summary: Eliminar un curso por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso a eliminar.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Curso eliminado exitosamente.
 *       '404':
 *         description: Curso no encontrado.
 */
//Eliminar un curso
router.delete('/course/:id',(req, res)=>{
    const { id } = req.params;
    course_model
        .deleteOne({ _id: id })
        .then((data)=> res.json(data))
        .catch((error)=> res.json({message:error}));
});

module.exports = router;