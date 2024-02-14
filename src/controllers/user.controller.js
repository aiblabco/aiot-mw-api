const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');

const throwUserNotFound = (userId) => {
  throw new ApiError(httpStatus.NOT_FOUND, 'not_found', `the user '${userId}' is not found`);
};

const throwUserExist = (key, extraInfo = '') => {
  if (extraInfo) {
    extraInfo = ` (${extraInfo})`;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'user_exist', `the user '${key}' is already exist.${extraInfo}`);
};

const addUser = catchAsync(async (req, res) => {
  const oldUser = await userService.getUserById(req.body.user_id);
  if (oldUser) {
    throwUserExist(req.body.user_id);
  }
  await userService.addUser(req.body);
  const user = await userService.getUserById(req.body.user_id);
  res.status(httpStatus.CREATED).json(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.user_id);
  if (!user) {
    throwUserNotFound(req.params.user_id);
  }
  await userService.deleteUserById(req.params.user_id);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.user_id);
  if (!user) {
    throwUserNotFound(req.params.user_id);
  }
  await userService.updateUserById(req.params.user_id, req.body, user.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.user_id);
  if (!user) {
    throwUserNotFound(req.params.user_id);
  }
  delete user.password;
  res.send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers();

  res.send(users);
});

module.exports = {
  addUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
};
