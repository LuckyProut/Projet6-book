const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.js');
const upload = require('../middleware/images.js');
const resizeImages = require('../middleware/imagesResize.js');
const booksCtrl = require('../controllers/books.js');

router.get('/bestrating', booksCtrl.getBestRating);
router.get('/', booksCtrl.getAllBooks);
router.get('/:id', booksCtrl.getOneBook);
router.post('/', auth, upload, resizeImages, booksCtrl.createBook);
router.post('/:id/rating', auth, booksCtrl.createRating);
router.put('/:id', auth, upload, resizeImages, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router; 