const { check, validationResult } = require('express-validator');

const validateSignup = [
  // Vérification email
  check('email')
    .isEmail().withMessage('L\'email doit être valide.')
    .normalizeEmail(),

//   vérification mdp
  check('password')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.')
    .matches(/\d/).withMessage('Le mot de passe doit contenir au moins un chiffre.')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule.')
    .matches(/[\W_]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial (comme !, @, #, $, etc.).'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Il y a des erreurs de validation.',
        errors: errors.array(),
      });
    }
    next();
  }
];

module.exports = validateSignup;