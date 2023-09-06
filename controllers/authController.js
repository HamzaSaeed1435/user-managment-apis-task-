const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const authLibs = require('../libs/authLibs');
const authSchema = require('../schema/authSchema');
const validationUtils = require('../utils/validationUtils');
const utilityHelper = require('../utils/utilityHelper');
const enums = require('../utils/enums');
const logger = require('../utils/logger');


async function register(request, response) {
  logger.info('Register api called ..');
  try {
    //extarct properties from request
    //just to extract data from req.body , thats why we just sedn true for body properties
    const userData = utilityHelper.getQueryParams(request, true); 

    //validate object aginst schema
    const validationReponse = validationUtils.validateObject(userData, authSchema.registrationSchema);
   
    if (!validationReponse.success) {
      logger.info('validation failed error');
      return response.status(enums.STATUS_CODES.BAD_REQUEST).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.VALIDATION_FAILED, {},  validationReponse.errors));
    }

     //check if user exist on same email then throw error
    const existingUser = await User.findOne({ email: userData.email });
    if (!utilityHelper.isNullOrEmpty(existingUser)) {
      logger.info('email already registered error');
      return response.status(enums.STATUS_CODES.BAD_REQUEST).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.EMAIL_ALREADY_REGISTERED, {}, null));
    }
    //hashed pasowrd
    const hashedPassword = await authLibs.hashPassword(userData.password);
    const user = new User({ email: userData.email, password: hashedPassword, dob: userData.dob });
    await user.save();

    return response.status(enums.STATUS_CODES.CREATED).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.SUCCESS, enums.API_CODES.USER_REGISTER_SUCCESSFULL, {user: { email: user.email, dob: user.dob }},  validationReponse.errors));
  } 
  catch (error) {
    logger.error('Internal Server Error',error);
    return response.status(enums.STATUS_CODES.INTERNAL_SERVER_ERROR).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.INTERNEL_SERVER_ERROR, {}, null));
  }
}

async function login(request, response) {
  logger.info('login api called ..');
  try {
    //extarct properties from request
    //just to extract data from req.body , thats why we just sedn true for body properties
    const userData = utilityHelper.getQueryParams(request, true);
    const validationResponse = validationUtils.validateObject(userData, authSchema.loginSchema);

    if (!validationResponse.success) {
      logger.info('validation failed error');
      return response.status(enums.STATUS_CODES.BAD_REQUEST).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.VALIDATION_FAILED, {}, validationResponse.errors));
    }

    const user = await User.findOne({ email: userData.email });
    if (utilityHelper.isNullOrEmpty(user)) { //if user  not exist in databse
      logger.info('incorrect email');
      return response.status(enums.STATUS_CODES.UNAUTHORIZED).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.AUTHENTICATION_FAILED, {}, null));
    }

    const passwordMatch = await authLibs.comparePassword(userData.password, user.password);
    if (!passwordMatch) {
      logger.info('incorrect password');
      return response.status(enums.STATUS_CODES.UNAUTHORIZED).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.AUTHENTICATION_FAILED, {}, null));
    }

    const accessToken = await authLibs.generateAccessToken(user._id);
    const refreshToken = await authLibs.generateRefreshToken(user._id);

    return response.status(enums.STATUS_CODES.OK).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.SUCCESS, enums.API_CODES.LOGIN_SUCCESSFUL, { user: { email: user.email, dob: user.dob }, accessToken, refreshToken }, null));
  } 
  catch (error) {
    logger.error('Internal Server Error',error);
    return response.status(enums.STATUS_CODES.INTERNAL_SERVER_ERROR).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.INTERNEL_SERVER_ERROR, {}, null));
  }
}



async function refreshAccessToken(request, response) {
  logger.info('refresh token API called...');

  try {
    // Extract properties from the request
    // Just to extract data from req.body, that's why we send true for body properties
    const data = utilityHelper.getQueryParams(request, true);
    const validationResponse = validationUtils.validateObject(data, authSchema.refreshTokenSchema);

    if (!validationResponse.success) {
      logger.info('Validation failed error');
      return response.status(enums.STATUS_CODES.BAD_REQUEST).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.VALIDATION_FAILED, {}, validationResponse.errors));
    }

    const user = await authLibs.verifyRefreshToken(data.refresh_token);

    if (utilityHelper.isNullOrEmpty(user)) {
      logger.info('Invalid refresh token error');
      return response.status(enums.STATUS_CODES.BAD_REQUEST).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.INVALID_REFRESH_TOKEN, {}, null));
    }

    const accessToken = await authLibs.generateAccessToken(user.user_id);

    return response.status(enums.STATUS_CODES.OK).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.SUCCESS, enums.API_CODES.ACCESS_TOKEN_GENERATED, { accessToken }, null));
  }
  catch (error) {
    logger.error('Internal Server Error',error);
    return response.status(enums.STATUS_CODES.INTERNAL_SERVER_ERROR).send(utilityHelper.generateResponse(enums.API_RESPONSE_STATUS.ERROR, enums.API_CODES.INTERNEL_SERVER_ERROR, {}, null));
  }
}



module.exports = {
  register,
  login,
  refreshAccessToken,
};
