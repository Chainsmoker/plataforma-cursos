const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const expressHandlebarsLayouts = require('express-handlebars-layouts');
const Handlebars = require('handlebars');
const session = require('express-session');
const passport = require('passport');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
require('dotenv').config();


const port = process.env.PORT || 3000;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'ByteMasters API',
      description: 'Esta API proporciona funcionalidades para la administración de cursos, temas y usuarios en la plataforma educativa. Permite realizar operaciones como la creación de nuevos cursos, la gestión de temas, la administración de usuarios y más. ',
    },
  },
  apis: ['./models/Course.js', 'services/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión a MongoDB establecida')
    //Topic.createCollection();
  })
  .catch(err => console.error('Error de conexión a MongoDB', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

Handlebars.registerHelper('compareStrings', function (str1, str2, options) {
  if (str1 === str2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('eq', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const localStrategy = require('./config/passport-local-strategy');
localStrategy(passport);

app.use((req, res, next) => {
  res.locals.user = req.user;  
  next();
});

app.use((req, res, next) => {
  res.locals.includePartial = (partialName, context) => {
    return res.render(partialName, context);
  };
  next();
});

app.engine('.hbs', exphbs.engine({ extname: '.hbs', helpers: expressHandlebarsLayouts }));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');

const courseRoutes = require('./routes/coursesRoutes');
const userRoutes = require('./routes/userRoutes');
const globalRoutes = require('./routes/globalRoutes');
const courses_endpoint = require('./services/courses');
const temas_endpoint = require('./services/temas');
const user_endpoint = require('./services/user')

app.use('/courses', courseRoutes);
app.use('/my-account', userRoutes);
app.use('/', globalRoutes);
app.use('/api', courses_endpoint, temas_endpoint, user_endpoint);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
