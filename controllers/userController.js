// userController.js
const User = require('../models/userModel');
const userLibs = require('../libs/userLibs');
const userSchema = require('../schema/userSchema');
const validationUtils = require('../utils/validationUtils');
const utilityHelper = require('../utils/utilityHelper');
const enums = require('../utils/enums');
const logger = require('../utils/logger');


async function listUsers(request, response){
  logger.info('listUsers API called ..');
  try {
    // Extract properties from request
    // Just to extract data from req.query, that's why we just send true for body properties
    const queryData = utilityHelper.getQueryParams(request, false, true);
    const validationResponse = validationUtils.validateObject(queryData, userSchema.listUsersSchema);

    if (!validationResponse.success) {
      logger.info('Validation failed error');
      return response.status(enums.STATUS_CODES.BAD_REQUEST).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.VALIDATION_FAILED, {}, validationResponse.errors));
    }

    const page = parseInt(queryData.page) || 1; // Get the requested page number, default to 1
    const perPage = parseInt(queryData.perPage) || 10; // Get the number of results per page, default to 10

    const skip = (page - 1) * perPage; // Calculate the number of documents to skip

    // Fetch user data with pagination
    const users = await User.find({}, { email: 1, _id: 0 })
      .skip(skip)
      .limit(perPage);

      return response.status(enums.STATUS_CODES.OK).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.SUCCESS, enums.API_CODES.DATA_FOUND, {users}, null));
  }
  catch (error) {
    logger.error('Internal Server Error',error);
    return response.status(enums.STATUS_CODES.INTERNAL_SERVER_ERROR).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.INTERNEL_SERVER_ERROR, {}, null));
  }
}


async function calculateAge(request, response) {
  logger.info('calculateAge API called ..');
  try {
    const userId = request.user.userId;
    const userAge = await userLibs.calculateUserAge(userId);

    if (utilityHelper.isNullOrEmpty(userAge)) {
      logger.info('User not found');
      return response.status(enums.STATUS_CODES.BAD_REQUEST).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.DATA_NOT_FOUND, {}, null));
    }

    logger.info('Age calculated successfully');
    return response.status(enums.STATUS_CODES.BAD_REQUEST).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.SUCCESS, enums.API_CODES.AGE_CALCULATED, {age: userAge}, null));
  } 
  catch (error) {
    logger.error('Internal Server Error',error);
    return response.status(enums.STATUS_CODES.INTERNAL_SERVER_ERROR).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.INTERNEL_SERVER_ERROR, {}, null));
  }
}


module.exports = {
  listUsers,
  calculateAge
}