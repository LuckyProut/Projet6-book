const Book = require('../models/book');
const averageRating = require('../const/averageRating');
const fs = require('fs');
const path = require('path');



// GET récupère tout les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ error }));
};

// GET récupère 1 livre
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

// GET récupère les 3 meilleurs
exports.getBestRating = (req, res, next) => {
    Book.find().sort({averageRating: -1}).limit(3)
        .then((books)=>res.status(200).json(books))
        .catch((error)=>res.status(404).json({ error }));
};

// POST création d'un livre
exports.createBook = (req, res, next) => {
    // Récupère l'objet book
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    // Crée une instance du modèle Book
    const book = new Book({
    ...bookObject,
    // Ajoute l'ID de l'utilisateur authentifié au livre
    userId: req.auth.userId,
    // Utilise le chemin du fichier (qui a été redimensionné dans le middleware)
    imageUrl: `${req.protocol}://${req.get('host')}/images/${path.basename(req.file.path)}`,
    averageRating: bookObject.ratings && bookObject.ratings.length > 0 ? bookObject.ratings[0].grade : null
    });
    book.save()
    .then(() => {
    res.status(201).json({ message: 'Livre enregistré avec succès !' });
    })
    .catch(error => {
    res.status(400).json({ error });
    });
};
  

// PUT modifier un livre
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : { ...req.body };
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message : '403: unauthorized request' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                req.file && fs.unlink(`images/${filename}`, (err => {
                        if (err) console.log(err);
                    })
                );
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch((error) => {
            res.status(404).json({ error });
        });
};

// DELETE supprime un livre
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: '403: unauthorized request' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(404).json({ error });
        });
};

// POST notation du livre
exports.createRating = (req, res, next) => {
    // on vérifie que la note est entre 1 et 5
    if (req.body.rating >= 0 && req.body.rating <= 5) {
        const ratingObject = { ...req.body, grade: req.body.rating };
        delete ratingObject._id;
        Book.findOne({_id: req.params.id})
            .then(book => {
                const newRatings = book.ratings;
                const userIdArray = newRatings.map(rating => rating.userId);
                // Vérifie si l'utilisateur a déjà noté le livre
                if (userIdArray.includes(req.auth.userId)) {
                    res.status(403).json({ message : 'Not authorized' });
                } else {
                    // Ajoute la nouvelle note à la liste des notes
                    newRatings.push(ratingObject);
                    // Calcule la moyenne des notes
                    const grades = newRatings.map(rating => rating.grade);
                    const averageGrades = averageRating.average(grades);
                    // Met à jour les notes et la moyenne du livre
                    book.averageRating = averageGrades;
                    Book.updateOne({ _id: req.params.id }, { ratings: newRatings, averageRating: averageGrades, _id: req.params.id })
                        .then(() => { res.status(201).json()})
                        .catch(error => { res.status(400).json( { error })});
                    res.status(200).json(book);
                }
            })
            .catch((error) => {
                res.status(404).json({ error });
            });
    } else {
        res.status(400).json({ message: 'La note doit être comprise entre 1 et 5' });
    }
};