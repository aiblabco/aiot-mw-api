const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, lnsService } = require('../services');
const config = require('../config/config');

const login = catchAsync(async (req, res) => {
  const user = await authService.loginUser(req.body.user_id, req.body.password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ ...tokens, scope: req.body.scope });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshToken = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refresh_token);
  res.send({ ...tokens, scope: req.body.scope });
});

const changePassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  const redirectUrl = req.body.redirectUrl || config.loginPageUrl;
  res.send({ redirectUrl });
});

const checkUserIdUsed = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.body.user_id);
  res.status(httpStatus.OK).json({
    isUsed: !!user,
  });
});

const getLnsToken = catchAsync(async (req, res) => {
  const token = await lnsService.getToken();
  res.status(httpStatus.OK).json(token);
});

module.exports = {
  token: login,
  getLnsToken,
  logout,
  refreshToken,
  changePassword,
  checkUserIdUsed,
};
