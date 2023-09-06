const Joi = require('joi');

const listUsersSchema = Joi.object({
  page: Joi.number().integer().min(1),
  perPage: Joi.number().integer().min(1),
});

module.exports = {
  listUsersSchema,
};
