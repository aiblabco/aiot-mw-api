const md5 = require('md5');
const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const tokenDb = require('../daos/sqlite/token-db');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with user_id and password
 * @param {string} userId
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUser = async (userId, password) => {
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'unauthorized', 'user is not exists');
  } else if (user.password !== userService.genEncryptedPassword(password)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'unauthorized', 'password is not correct');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  await tokenDb.deleteByToken(md5(refreshToken), tokenTypes.REFRESH, false);
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user_id);
    if (!user) {
      throw new Error();
    }
    await tokenDb.deleteByToken(md5(refreshToken), tokenTypes.REFRESH, false);
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'invalid_grant', 'Invalid refresh token');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user_id);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.user_id, { password: newPassword });
    await tokenDb.deleteAll(user.user_id, tokenTypes.RESET_PASSWORD);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user_id);
    if (!user) {
      throw new Error();
    }
    await tokenDb.deleteAll(user.user_id, tokenTypes.VERIFY_EMAIL);
    await userService.updateUserById(user.user_id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUser,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
