const Joi = require('joi');

/**
 * Validate an request object against a Joi schema.
 *
 * @param {Object} object - object to be validated
 * @param {Joi.Schema} schema . schema against validation
 * @returns {Object}
 */
function validateObject(object, schema) {
  const { error } = schema.validate(object, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return { success: false, errors };
  }

  return { success: true, errors: [] };
}

module.exports = {validateObject }
