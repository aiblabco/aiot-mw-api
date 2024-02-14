const catchAsync = require('../utils/catchAsync');
const { edgexService, deviceProfileService, deviceService } = require('../services');
const { checkDeviceAndCommand } = require('./device.controller');

const getDeviceGetCommandResult = async (devId, commandName, data) => {
  const result = {
    dev_id: devId,
    command: commandName,
    response: [],
    timestamp: new Date().getTime(),
  };

  let deviceProfile = null;
  try {
    const device = await deviceService.getDeviceByDevId(devId);
    deviceProfile = await deviceProfileService.getDeviceProfileByName(device.device_profile);
  } catch (e) {
    // nothing
  }

  data.event?.readings?.forEach((item) => {
    const resource = deviceProfile?.resources.find((resource) => resource.name == item.resourceName);
    const responseItem = {
      resource_name: '',
      type: '',
      value_type: '',
      readings: [],
    };

    if (resource) {
      responseItem.type = resource.type;
      responseItem.value_type = resource.value_type;
    }
    if (resource.type === 'Object') {
      responseItem.units = resource.units;
    }

    responseItem.readings.push({
      created: parseInt(item.origin / 10000),
      value: resource.type === 'Object' ? item.objectValue : item.value,
    });
    result.response.push(responseItem);
  });

  return result;
};

const sendCommand = catchAsync(async (req, res) => {
  const devId = req.params.dev_id;
  const commandName = req.params.command_name;
  const data = req.body.parameter;
  const method = req.body.method;

  await checkDeviceAndCommand(devId, commandName);

  if (method === 'get') {
    const data = await edgexService.sendGetCommand(devId, commandName);
    const result = await getDeviceGetCommandResult(devId, commandName, data);
    res.send(result);
  } else if (method === 'set') {
    await edgexService.sendPutCommand(devId, commandName, data);
    res.send({
      device_id: devId,
      command: commandName,
      response: 'control is sent to device',
      timestamp: new Date().getTime(),
    });
  } else {
    res.send();
  }
});

module.exports = {
  sendCommand,
};
