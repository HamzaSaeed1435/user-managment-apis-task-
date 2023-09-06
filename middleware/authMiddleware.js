const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const enums = require('../utils/enums');
const utilityHelper = require('../utils/utilityHelper');
const logger = require('../utils/logger');

const TOKEN_HEADER = 'Authorization';

const jwtMiddleware = (req, res, next) => {
  const token = req.header(TOKEN_HEADER);

  if (!token) {
    return res.status(enums.STATUS_CODES.UNAUTHORIZED).send(
      utilityHelper.generateResponse(
        enums.API_RESPONSE_STATUS.ERROR,
        enums.API_CODES.MISSING_TOKEN,
        {},
        null
      )
    );
  }

  try {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(enums.STATUS_CODES.FORBIDDEN).send(
          utilityHelper.generateResponse(
            enums.API_RESPONSE_STATUS.ERROR,
            enums.API_CODES.INVALID_TOKEN,
            {},
            null
          )
        );
      }

      // Check if the token is expired
      if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
        return res.status(enums.STATUS_CODES.UNAUTHORIZED).send(
          utilityHelper.generateResponse(
            enums.API_RESPONSE_STATUS.ERROR,
            enums.API_CODES.EXPIRED_TOKEN,
            {},
            null
          )
        );
      }

      // Set the user object on the request
      req.user = decodedToken;

      // Proceed to the next middleware or route handler
      next();
    });
  } catch (error) {
    // Log the error
    logger.error('Internal Server Error', error);

    // Return an internal server error response
    return res.status(enums.STATUS_CODES.INTERNAL_SERVER_ERROR).send(
      utilityHelper.generateResponse(
        enums.API_RESPONSE_STATUS.ERROR,
        enums.API_CODES.INTERNEL_SERVER_ERROR,
        {},
        null
      )
    );
  }
};

module.exports = jwtMiddleware;
