const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

// Redimensionnement de l'image
const resizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  const fileName = req.file.filename;
  const outputFilePath = path.join('images', `resized_${fileName}`);

  sharp(filePath)
    .resize({ width: 206, height: 260 })
    .toFile(outputFilePath)
    .then(() => {
      // Utilisation d'une approche avec promesse pour supprimer le fichier
      fs.promises.unlink(filePath)
        .then(() => {
          console.log('Fichier original supprimé avec succès');
        })
        .catch((err) => {
          console.log('Erreur lors de la suppression du fichier original:', err);
        });

      req.file.path = outputFilePath;
      next();
    })
    .catch(err => {
      console.log('Erreur de traitement de l\'image:', err);
      return next();
    });
};

module.exports = resizeImage;
