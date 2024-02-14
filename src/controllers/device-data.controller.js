const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const { edgexService, deviceService, deviceProfileService } = require('../services');
const { checkDeviceAndResource } = require('./device.controller');

const genDeviceResourceDataResult = async (devId, resourceName, data) => {
  const result = {
    dev_id: devId,
    resource_name: resourceName,
    type: '',
    valueType: '',
    readings: [],
  };

  let deviceProfile = null;
  try {
    const device = await deviceService.getDeviceByDevId(devId);
    deviceProfile = await deviceProfileService.getDeviceProfileByName(device.device_profile);
  } catch (e) {
    // nothing
  }
  const resource = deviceProfile?.resources.find((item) => item.name == resourceName);

  if (resource) {
    result.type = resource.type;
    result.valueType = resource.valueType;
  }
  if (resource.type === 'Object') {
    result.units = resource.units;
  }

  data?.readings?.forEach((item) => {
    result.readings.push({
      created: parseInt(item.origin / 10000),
      value: resource.type === 'Object' ? item.objectValue : item.value,
    });
  });

  return result;
};

const getDeviceResourceRecentData = catchAsync(async (req, res) => {
  const devId = req.params.dev_id;
  const resourceName = req.params.resource_name;
  const count = req.params.count;
  await checkDeviceAndResource(devId, resourceName);

  const data = await edgexService.getDeviceResourceRecentData(devId, resourceName, count);
  const result = await genDeviceResourceDataResult(devId, resourceName, data);
  res.send(result);
});

const getDeviceResourceHistoryData = catchAsync(async (req, res) => {
  const devId = req.params.dev_id;
  const resourceName = req.params.resource_name;
  const from = moment(req.params.from, 'YYYYMMDDHHmmss').valueOf() * 1000000;
  const to = moment(req.params.to, 'YYYYMMDDHHmmss').valueOf() * 1000000;
  await checkDeviceAndResource(devId, resourceName);

  const data = await edgexService.getDeviceResourceHistoryData(devId, resourceName, from, to);
  const result = await genDeviceResourceDataResult(devId, resourceName, data);
  res.send(result);
});

module.exports = {
  getDeviceResourceRecentData,
  getDeviceResourceHistoryData,
};
