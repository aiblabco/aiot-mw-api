const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { objectTypeService } = require('../services');
const ApiError = require('../utils/ApiError');

const throwObjectTypeNotFound = (key) => {
  throw new ApiError(httpStatus.NOT_FOUND, 'not_found', `the object type '${key}' is not found`);
};

const throwObjectTypeExist = (key, extraInfo = '') => {
  if (extraInfo) {
    extraInfo = ` (${extraInfo})`;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'object_type_exist', `the object type '${key}' is already exist.${extraInfo}`);
};

const addObjectType = catchAsync(async (req, res) => {
  const oldObjectType = await objectTypeService.getObjectTypeByName(req.body.name);
  if (oldObjectType) {
    throwObjectTypeExist(req.body.name);
  }
  await objectTypeService.addObjectType(req.body);
  const network = await objectTypeService.getObjectTypeByName(req.body.name);
  res.status(httpStatus.CREATED).json(network);
});

const deleteObjectTypeByName = catchAsync(async (req, res) => {
  const oldObjectType = await objectTypeService.getObjectTypeByName(req.params.name);
  if (!oldObjectType) {
    throwObjectTypeNotFound(req.params.name);
  }
  await objectTypeService.deleteObjectTypeByName(req.params.name);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateObjectTypeByName = catchAsync(async (req, res) => {
  const oldObjectType = await objectTypeService.getObjectTypeByName(req.params.name);
  if (!oldObjectType) {
    throwObjectTypeNotFound(req.params.name);
  }
  await objectTypeService.updateObjectTypeByName(req.params.name, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

const getObjectTypeByName = catchAsync(async (req, res) => {
  const objectType = await objectTypeService.getObjectTypeByName(req.params.name);
  if (!objectType) {
    throwObjectTypeNotFound(req.params.name);
  }
  res.send(objectType);
});

const getObjectTypes = catchAsync(async (req, res) => {
  const objectTypes = await objectTypeService.getObjectTypes();

  res.send(objectTypes);
});

module.exports = {
  addObjectType,
  getObjectTypeByName,
  getObjectTypes,
  deleteObjectTypeByName,
  updateObjectTypeByName,
  throwObjectTypeNotFound,
  throwObjectTypeExist,
};
