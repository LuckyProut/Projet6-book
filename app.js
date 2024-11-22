const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const booksRoutes = require('./routes/books.js');
const userRoutes = require('./routes/user.js');

const app = express();
mongoose.connect('mongodb+srv://lucgarrouste:Lucio_68420@cluster0.8psgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

app.use(express.json());
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');  
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src *; ...")
  next();
});


 
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.get('/', (req, res) => {
  res.send('<img src="/images/resized_image.jpg" alt="Image">');
});
module.exports = app; 