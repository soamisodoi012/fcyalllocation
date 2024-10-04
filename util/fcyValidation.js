const { body } = require('express-validator');

const fcyValidationRules = () => {
  return [
    // Validate importerPhone (starts with country code and is numeric)
    body('importerPhone')
      .matches(/^\+\d{1,3}\d{9,14}$/)
      .withMessage('Phone number must start with a country code (e.g., +251) and be between 10 and 15 digits long, including the country code'),

    // Validate importerTIN (alphanumeric and length between 10-15 characters)
    body('importerTIN')
      .isAlphanumeric()
      .withMessage('TIN must contain only alphanumeric characters')
      .isLength({ min: 10, max: 15 })
      .withMessage('TIN must be between 10 and 15 characters long'),

    // Validate importerName (alphabetic only)
    body('importerName')
      .isAlpha()
      .withMessage('Importer name must contain only alphabetic characters')
      .isLength({ min: 1 })
      .withMessage('Importer name cannot be empty'),

    // Validate proformaAmount (greater than 0 and valid decimal)
    body('proformaAmount')
      .isFloat({ gt: 0 })
      .withMessage('Proforma amount must be a positive number')
      .matches(/^\d+(\.\d+)?$/)
      .withMessage('Proforma amount must be a valid decimal number'),

    // Validate hsCode (specific pattern, e.g., must be 6-10 digits long)
    body('hsCode')
      .matches(/^\d{6,10}$/)
      .withMessage('HS Code must be between 6 and 10 digits long and contain only numbers')
  ];
};

module.exports = {
    fcyValidationRules,
};
