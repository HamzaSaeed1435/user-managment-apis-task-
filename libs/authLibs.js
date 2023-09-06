const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET, REFRESH_TOKEN_SECRET } = require('../config');
const enums = require('../utils/enums')
/**
 * generate Access Token
 */
async function generateAccessToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: enums.ACCESS_TOKEN_EXPIRY_TIME,
  });
}


/**
 * generate Refresh Token
 */
async function generateRefreshToken(userId) {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: enums.REFRESH_TOKEN_EXPIRY_TIME,
  });
}

/**
 * hashed password
 */
async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}


/**
 * Compare a plain text password with a hashed password.
 */
async function comparePassword(plainTextPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
}

/**
 * for varification of refresh token
 */
async function verifyRefreshToken(refreshToken) {
  try {
    const user = await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    return user || null;
  } catch (error) {
    logger.info(error)
    return null; // Return null on error (invalid token)
  }
}



module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
  verifyRefreshToken
};
