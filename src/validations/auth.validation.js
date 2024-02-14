const Joi = require('joi');
const { password } = require('./custom.validation');

const login = {
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    password: Joi.string().required(),
    grant_type: Joi.string(),
    scope: Joi.string(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refresh_token: Joi.string().required(),
    grant_type: Joi.string(),
    scope: Joi.string(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    redirectUrl: Joi.string().allow(null, ''),
    password: Joi.string().required().custom(password),
    password2: Joi.string().required().custom(password),
  }),
};

const checkUserId = {
  body: Joi.object().keys({
    user_id: Joi.string().required(),
  }),
};

const checkEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

module.exports = {
  login,
  logout,
  refreshTokens,
  changePassword,
  checkUserId,
  checkEmail,
};
