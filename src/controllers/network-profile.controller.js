const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { networkProfileService } = require('../services');
const ApiError = require('../utils/ApiError');

const throwNetworkProfileNotFound = (key) => {
  throw new ApiError(httpStatus.NOT_FOUND, 'not_found', `the network profile '${key}' is not found`);
};

const throwNetworkProfileExist = (key, extraInfo = '') => {
  if (extraInfo) {
    extraInfo = ` (${extraInfo})`;
  }
  throw new ApiError(
    httpStatus.BAD_REQUEST,
    'network_profile_exist',
    `the network profile '${key}' is already exist.${extraInfo}`,
  );
};

const addNetworkProfile = catchAsync(async (req, res) => {
  const oldNetworkProfile = await networkProfileService.getNetworkProfileByName(req.body.name);
  if (oldNetworkProfile) {
    throwNetworkProfileExist(req.body.name);
  }
  await networkProfileService.addNetworkProfile(req.body);
  const network = await networkProfileService.getNetworkProfileByName(req.body.name);
  res.status(httpStatus.CREATED).json(network);
});

const deleteNetworkProfileByName = catchAsync(async (req, res) => {
  const oldNetworkProfile = await networkProfileService.getNetworkProfileByName(req.params.name);
  if (!oldNetworkProfile) {
    throwNetworkProfileNotFound(req.params.name);
  }
  await networkProfileService.deleteNetworkProfileByName(req.params.name);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateNetworkProfileByName = catchAsync(async (req, res) => {
  const oldNetworkProfile = await networkProfileService.getNetworkProfileByName(req.params.name);
  if (!oldNetworkProfile) {
    throwNetworkProfileNotFound(req.params.name);
  }
  await networkProfileService.updateNetworkProfileByName(req.params.name, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

const getNetworkProfileByName = catchAsync(async (req, res) => {
  const networkProfile = await networkProfileService.getNetworkProfileByName(req.params.name);
  if (!networkProfile) {
    throwNetworkProfileNotFound(req.params.name);
  }
  res.send(networkProfile);
});

const getNetworkProfiles = catchAsync(async (req, res) => {
  const networkProfiles = await networkProfileService.getNetworkProfiles();

  res.send(networkProfiles);
});

module.exports = {
  addNetworkProfile,
  getNetworkProfileByName,
  getNetworkProfiles,
  deleteNetworkProfileByName,
  updateNetworkProfileByName,
  throwNetworkProfileNotFound,
  throwNetworkProfileExist,
};
