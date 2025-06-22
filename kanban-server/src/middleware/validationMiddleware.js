const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.validateList = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('List name must be at least 2 characters long'),
  body('boardId')
    .isMongoId()
    .withMessage('Board ID must be a valid MongoDB ObjectId'),
  handleValidationErrors,
];

exports.validateCard = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Card title is required'),
  body('listId')
    .isMongoId()
    .withMessage('List ID must be a valid MongoDB ObjectId'),
  body('boardId')
    .isMongoId()
    .withMessage('Board ID must be a valid MongoDB ObjectId'),
  handleValidationErrors,
];
