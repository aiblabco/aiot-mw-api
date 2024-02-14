const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { deviceModelService } = require('../services');

const genDeviceProfileModel = catchAsync(async (req, res) => {
  const deviceModel = await deviceModelService.genDeviceProfileForEdgex(req.body);
  res.status(httpStatus.CREATED).json(deviceModel);
});

module.exports = {
  genDeviceProfileModel,
};
