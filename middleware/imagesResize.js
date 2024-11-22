const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

// Middleware de redimensionnement de l'image
const resizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  const tempFilePath = filePath + '.temp';  

  sharp(filePath)
    .resize({ width: 206, height: 260 })
    .toFile(tempFilePath)  
    .then(() => {
      fs.promises.rename(tempFilePath, filePath)
        .then(() => {
          console.log('Image redimensionnée et remplacée avec succès');
          next();
        })
        .catch((err) => {
          console.log('Erreur lors du remplacement du fichier original:', err);
          next();
        });
    })
    .catch(err => {
      console.log('Erreur de traitement de l\'image:', err);
      next();
    });
};

module.exports = resizeImage;
