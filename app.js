const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const Book = require('./models/book');
const booksRoutes = require('./routes/books');

const app = express();
mongoose.connect('mongodb+srv://lucgarrouste:Lucio_68420@cluster0.8psgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

  app.use(cors({ origin: 'http://localhost:3000' }));
  // app.use('/api/books', (req, res, next) => {
  //   Book.find()
  //     .then(books => res.status(200).json(books))
  //     .catch(error => res.status(400).json({ error }));
  // });

  // app.use('/api/books/:id', (req, res, next) => {
  //   bookSchema.findOne({ id: req.params.id })
  //     .then(things => res.status(200).json(things))
  //     .catch(error => res.status(400).json({ error }));
  // });

  app.use('/api/books', booksRoutes);
  
module.exports = app;