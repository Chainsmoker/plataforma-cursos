const mongoose = require('mongoose');

const temaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  lessons: [
    {
        name: String,
        videoUrl: String,
        content: String,
        lessonId: String,
    }
],
});

const Tema = mongoose.model('Tema', temaSchema);

module.exports = Tema;
