const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

const app = express();
mongoose.connect('mongodb+srv://lucgarrouste:Lucio_68420@cluster0.8psgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' }));

 
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
  
module.exports = app; 