const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Tema = require('../models/Tema');

const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().sort({ created_at: -1 }).lean();
        res.render('pages/courses', { pageTitle: 'Todos los cursos', courses, active: 'courses' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/detail/:slug', async (req, res) => {
    try {
      const { slug } = req.params;

      const course = await Course.findOne({ slug }).lean();
      const courses = await Course.find().sort({ created_at: -1 }).lean();

      if (!course) {
        return res.status(404).send('Curso no encontrado');
      }

      const temaIds = course.temario; 
      const tema = await Tema.find({ _id: { $in: temaIds } }).lean();

      const fechaHora = new Date(course.actualizado);

      //const fechaFormateada = fechaHora.toISOString().split('T')[0];
      const fechaFormateada = 12
      res.render('pages/courseDetail', { pageTitle: course.nombre, course, fechaFormateada, courses, tema, active: 'courses' });
    } catch (error) {
      console.error('Error al buscar el curso por el slug', error);
      res.status(500).send('Error interno del servidor');
    }
});

router.get('/lessons/:slug/:lessonId?', async (req, res) => {
    if (!req.isAuthenticated()){
      return res.redirect('/my-account/login')
    }

    try {
      const { slug, lessonId } = req.params;
      const course = await Course.findOne({ slug }).lean();
      const courses = await Course.find().sort({ created_at: -1 }).lean();

      //const lesson = await Lesson.findOne({ lessonId }).lean();

      if (!course) {
        return res.status(404).send('Curso no encontrado');
      }

      const temaIds = course.temario; 
      const temas = await Tema.find({ _id: { $in: temaIds } }).lean();

      let lesson = null;

      if (lessonId){
        for (const tema of temas) {
          const foundLesson = tema.lessons.find((lesson) => lesson.lessonId === lessonId);
          if (foundLesson) {
            lesson = foundLesson;
            break;
          }
        }
      }
      const courseId = course._id


      if (lessonId !== null) {
        const result = await User.findOneAndUpdate(
          { 
            _id: req.user._id,
            'coursesViewed.courseId': courseId
          },
          {
            $set: {
              'coursesViewed.$.lessonId': lessonId
            }
          },
          {
            new: true
          }
        );

        if (!result) {
          await User.updateOne(
            { _id: req.user._id },
            {
              $addToSet: {
                coursesViewed: { courseId, lessonId }
              }
            }
          );
        }
      }
      

      res.render('pages/startCourse', { pageTitle: course.nombre, course, courses, lesson, temas, nextLessonId: parseInt(lessonId) + 1, active: 'courses' });
    } catch (error) {
        console.error('Error al buscar el curso por el slug', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
