const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  nivel: {
    type: String,
    required: true,
  },
  duracion: {
    type: Number,
    required: true,
  },
  lema: String,
  descripcion: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  resultado: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
  },
  recursos: [String],
  temario: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tema',
    },
  ],
  
  presentacion: String,
  lema: String,
  img: String,
  courseForYou: [
    {
      icon: String,
      title: String,
      description: String
    }
  ],
  utilities: [
    {
      icon: String,
      title: String,
      description: String,
      link: String
    }
  ]
});


const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
