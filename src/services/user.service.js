const md5 = require('md5');
const userDao = require('../daos/sqlite/user-db');

const genEncryptedPassword = (password) => {
  return md5(password);
};
/**
 * Add a user
 * @param {Object} userData
 * @returns  {Object}
 */
const addUser = async (userData) => {
  const newUserData = {
    ...userData,
    password: genEncryptedPassword(userData.password),
  };
  return await userDao.createOne(newUserData);
};

const updateUserById = async (userId, userData, oldPassword) => {
  const newUserData = {
    ...userData,
  };
  if (newUserData.password) {
    newUserData.password = genEncryptedPassword(userData.password);
  } else {
    newUserData.password = oldPassword;
  }
  return await userDao.updateById(userId, newUserData);
};

const deleteUserById = async (userId) => {
  return await userDao.deleteById(userId);
};

const getUserById = async (userId) => {
  return await userDao.selectById(userId);
};

const getUsers = async () => {
  return await userDao.selectAll();
};

module.exports = {
  addUser,
  updateUserById,
  deleteUserById,
  getUserById,
  getUsers,
  genEncryptedPassword,
};
