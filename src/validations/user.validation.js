const Joi = require('joi');
const { password } = require('./custom.validation');
const { roles } = require('../config/roles');
/*
 * Columns	
  user_id,
  name,
  password,
  email,
  role  
*/
const addUser = {
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().custom(password).required(),
    role: Joi.string().valid(roles.ROLE_ADMIN, roles.ROLE_USER).required(),    
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    user_id: Joi.string().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    user_id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    password: Joi.string().custom(password).allow(null),
    role: Joi.string().valid(roles.ROLE_ADMIN, roles.ROLE_USER).required(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    user_id: Joi.string().required(),
  }),
};

const getUsers = {};

module.exports = {
  addUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
};
