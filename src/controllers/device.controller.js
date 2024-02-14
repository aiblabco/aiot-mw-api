const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  deviceService,
  edgexService,
  applicationService,
  networkProfileService,
  deviceProfileService,
  lnsService,
} = require('../services');
const { throwApplicationNotFound } = require('./application.controller');
const { throwNetworkProfileNotFound } = require('./network-profile.controller');
const { throwDeviceProfileNotFound } = require('./device-profile.controller');
const { genDeviceForEdgex } = require('../services/device-model.service');
const ApiError = require('../utils/ApiError');

const throwDeviceResourceNotFound = (key, extraInfo = '') => {
  if (extraInfo) {
    extraInfo = ` (${extraInfo})`;
  }
  throw new ApiError(httpStatus.NOT_FOUND, 'not_found', `the device resource '${key}' is not found.${extraInfo}`);
};
const throwDeviceCommandNotFound = (key, extraInfo = '') => {
  if (extraInfo) {
    extraInfo = ` (${extraInfo})`;
  }
  throw new ApiError(httpStatus.NOT_FOUND, 'not_found', `the device command '${key}' is not found.${extraInfo}`);
};
const throwDeviceNotFound = (key, extraInfo = '') => {
  if (extraInfo) {
    extraInfo = ` (${extraInfo})`;
  }
  throw new ApiError(httpStatus.NOT_FOUND, 'not_found', `the device '${key}' is not found.${extraInfo}`);
};
const throwDeviceExist = (key, extraInfo = '') => {
  if (extraInfo) {
    extraInfo = ` (${extraInfo})`;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'device_exist', `the device '${key}' is already exist.${extraInfo}`);
};

const addDeviceProcess = async (reqDevice) => {
  /**
   * 1. DB 확인
   * 2. Edgex 확인
   * 3. Application 확인
   * 4. Network Profile 확인
   * 5. Device Profile 확인
   * 6. LNS 확인
   * 6.1 Application으로 목록 조회 후 app_id로 확인
   * 6.1 dev_eui가 명시된 경우 dev_eui 비교
   * . LNS 저장
   * . Edgex 저장
   * . DB 저장
   */

  let lnsCreated = false;
  let edgexCreated = false;

  // DB 확인
  const oldDevice = await deviceService.getDeviceByDevId(reqDevice.dev_id);
  if (oldDevice) {
    throwDeviceExist(reqDevice.dev_id);
  }

  // Edgex 확인
  try {
    const edgexDevice = await edgexService.getDeviceByName(reqDevice.dev_id);
    if (edgexDevice) {
      throwDeviceExist(reqDevice.dev_id, 'edgex');
    }
  } catch (e) {
    if (e.response.status !== httpStatus.NOT_FOUND) {
      throw e;
    }
  }

  // Application 확인
  const application = await applicationService.getApplicationByAppId(reqDevice.app_id);
  if (!application) {
    throwApplicationNotFound(reqDevice.app_id);
  }

  // NetworkProfile 확인
  const networkProfile = await networkProfileService.getNetworkProfileByName(reqDevice.network_profile);
  if (!networkProfile) {
    throwNetworkProfileNotFound(reqDevice.network_profile);
  } else {
    reqDevice.activation_type = networkProfile.activation_type;
    reqDevice.lorawan_class = networkProfile.lorawan_class;
    reqDevice.lorawan_version = networkProfile.lorawan_version;
    reqDevice.channel_plan = networkProfile.channel_plan;
    if (networkProfile.activation_type === 'OTAA') {
      reqDevice.app_key = networkProfile.app_key;
    } else if (networkProfile.activation_type === 'ABP') {
      if(!reqDevice.dev_addr){
        throw new ApiError(httpStatus.BAD_REQUEST, 'bad_request', `dev_addr is required.`);
      }else if(!/^00[0-9a-fA-F]{6}$/.test(reqDevice.dev_addr)){
        throw new ApiError(httpStatus.BAD_REQUEST, 'bad_request', `invalid dev_addr format.`);
      }
      reqDevice.app_s_key = networkProfile.app_s_key;
      reqDevice.nwk_s_key = networkProfile.nwk_s_key;
    }
  }

  // DeviceProfile 확인
  const deviceProfile = await deviceProfileService.getDeviceProfileByName(reqDevice.device_profile);
  if (!deviceProfile) {
    throwDeviceProfileNotFound(reqDevice.device_profile);
  }

  // Application 타입이 MIN 이면 LNS에 Device 생성
  if (application.app_type === 'MIN') {
    const checkSameLnsDevice = (newDevice, oldDevice) => {
      if (newDevice.activation_type === 'OTAA') {
        return (
          newDevice.dev_id == oldDevice.dev_id &&
          newDevice.activation_type == oldDevice.activation_type &&
          newDevice.lorawan_class == oldDevice.lorawan_class &&
          newDevice.lorawan_version == oldDevice.lorawan_version &&
          newDevice.channel_plan == oldDevice.channel_plan &&
          newDevice.app_key == oldDevice.app_key
        );
      } else if (newDevice.activation_type === 'ABP') {
        return (
          newDevice.dev_id == oldDevice.dev_id &&
          newDevice.activation_type == oldDevice.activation_type &&
          newDevice.lorawan_class == oldDevice.lorawan_class &&
          newDevice.lorawan_version == oldDevice.lorawan_version &&
          newDevice.channel_plan == oldDevice.channel_plan &&
          newDevice.app_s_key == oldDevice.app_s_key &&
          newDevice.nwk_s_key == oldDevice.nwk_s_key
        );
      } else {
        return false;
      }
    };

    let foundLnsDevice = false;
    const lnsDeviceList = (await lnsService.getAppDeviceList(application.app_eui)).devices;
    if (reqDevice.dev_eui) {
      // eui가 명시된 경우 해당 eui로 검색 후 같은 지 확인
      const lnsDeviceByDevEui = lnsDeviceList.find((device) => device.dev_eui === reqDevice.dev_eui);
      if (lnsDeviceByDevEui) {
        if (checkSameLnsDevice(reqDevice, lnsDeviceByDevEui)) {
          foundLnsDevice = true;
        } else {
          throwDeviceExist(reqDevice.dev_eui, 'lns');
        }
      } else {
        const lnsDeviceByDevId = lnsDeviceList.find((device) => device.dev_id === reqDevice.dev_id);
        if (lnsDeviceByDevId) {
          throwDeviceExist(reqDevice.dev_id, 'lns');
        }
      }
    } else {
      const lnsDeviceByDevId = lnsDeviceList.find((device) => device.dev_id === reqDevice.dev_id);
      if (lnsDeviceByDevId) {
        if (checkSameLnsDevice(reqDevice, lnsDeviceByDevId)) {
          foundLnsDevice = true;
          reqDevice.dev_eui = lnsDeviceByDevId.dev_eui; // eui 세팅
        } else {
          throwDeviceExist(reqDevice.dev_id, 'lns');
        }
      }
    }
    if (!foundLnsDevice) {
      const lnsDevice = JSON.parse(JSON.stringify(reqDevice));
      delete lnsDevice.network_profile;
      delete lnsDevice.device_profile;
      delete lnsDevice.app_id;
      delete lnsDevice.enabled;
      delete lnsDevice.dev_eui;
      if (lnsDevice.activation_type === 'OTAA') {
        delete lnsDevice.dev_addr;
      }
      const newLnsDevice = (await lnsService.addDevice(application.app_eui, lnsDevice)).device;
      reqDevice.dev_eui = newLnsDevice.dev_eui;
      lnsCreated = true;
    }
  }

  try {
    await edgexService.addDevice(await genDeviceForEdgex(reqDevice));
    edgexCreated = true;
    await deviceService.addDevice(reqDevice);
  } catch (e) {
    if (lnsCreated) {
      // LNS 디바이스를 생성한경우, 삭제 진행
      await lnsService.deleteDevice(application.app_eui, reqDevice.dev_eui);
    }
    if (edgexCreated) {
      // edgex 디바이스를 생성한경우, 삭제 진행
      await edgexService.deleteDeviceByName(reqDevice.dev_id);
    }
    throw e;
  }
  const device = await deviceService.getDeviceByDevId(reqDevice.dev_id);
  return device;
};

const addDevice = catchAsync(async (req, res) => {
  const reqDevice = req.body;
  const device = await addDeviceProcess(reqDevice);
  res.status(httpStatus.CREATED).json(device);
});

const addDeviceGroup = catchAsync(async (req, res) => {
  const reqDevices = req.body.devices;
  const result = {
    createdDevices: [],
    failedDevices: [],
  };
  for (let reqDevice of reqDevices) {
    try {
      await addDeviceProcess(reqDevice);
      result.createdDevices.push(reqDevice.dev_id);
    } catch (e) {
      result.failedDevices.push({
        dev_id: reqDevice.dev_id,
        error: {
          error: 'bad_request',
          error_description: e.errorDescription,
        },
      });
    }
  }
  res.send(result);
});

const deleteDeviceByDevId = catchAsync(async (req, res) => {
  // DB 확인
  const oldDevice = await deviceService.getDeviceByDevId(req.params.dev_id);
  if (!oldDevice) {
    throwDeviceNotFound(req.params.dev_id);
  }
  try {
    await lnsService.deleteDevice(oldDevice.app_eui, oldDevice.dev_eui);
  } catch (e) {
    if (e.response.status !== httpStatus.NOT_FOUND) {
      throw e;
    }
  }
  try {
    await edgexService.deleteDeviceByName(oldDevice.dev_id);
  } catch (e) {
    if (e.response.status !== httpStatus.NOT_FOUND) {
      throw e;
    }
  }
  await deviceService.deleteDeviceByDevId(req.params.dev_id);
  res.status(httpStatus.NO_CONTENT).send();
});

//! UPDATE DEVICE
const updateDeviceByDevId = catchAsync(async (req, res) => {
  const reqDevice = req.body;
  reqDevice.dev_id = req.params.dev_id;

  // DB 확인
  const oldDevice = await deviceService.getDeviceByDevId(reqDevice.dev_id);
  if (!oldDevice) {
    throwDeviceNotFound(reqDevice.dev_id);
  }

  // Application 확인
  const application = await applicationService.getApplicationByAppId(oldDevice.app_id);
  if (!application) {
    throwApplicationNotFound(oldDevice.app_id);
  }

  // NetworkProfile 확인
  const networkProfile = await networkProfileService.getNetworkProfileByName(oldDevice.network_profile);
  if (!networkProfile) {
    throwNetworkProfileNotFound(oldDevice.network_profile);
  }

  // DeviceProfile 확인
  const deviceProfile = await deviceProfileService.getDeviceProfileByName(oldDevice.device_profile);
  if (!deviceProfile) {
    throwDeviceProfileNotFound(oldDevice.device_profile);
  }

  // Edgex 확인
  try {
    await edgexService.getDeviceByName(reqDevice.dev_id);
  } catch (e) {
    if (e.response.status === httpStatus.NOT_FOUND) {
      await deviceService.setDeviceDisabled(reqDevice.dev_id); //! disabled
      throwDeviceNotFound(reqDevice.dev_id, 'edgex');
    } else {
      throw e;
    }
  }

  // Application 타입이 MIN 이면 LNS Device 업데이트
  if (application.app_type === 'MIN') {
    // lns 확인
    try {
      await lnsService.getAppDevice(application.app_eui, oldDevice.dev_eui);
      const lnsDevice = JSON.parse(JSON.stringify(reqDevice));
      await lnsService.updateDevice(application.app_eui, oldDevice.dev_eui, lnsDevice);
    } catch (e) {
      if (e.response.status === httpStatus.NOT_FOUND) {
        await deviceService.setDeviceDisabled(reqDevice.dev_id); //! disabled
        throwDeviceNotFound(reqDevice.dev_id, 'lns');
      } else {
        throw e;
      }
    }
  }
  reqDevice.device_profile = oldDevice.device_profile;
  await edgexService.updateDevice(await genDeviceForEdgex(reqDevice));
  await deviceService.updateDeviceByDevId(reqDevice.dev_id, reqDevice);
  res.status(httpStatus.NO_CONTENT).send();
});

const getDeviceByDevId = catchAsync(async (req, res) => {
  const device = await deviceService.getDeviceByDevId(req.params.dev_id);
  if (!device) {
    throwDeviceNotFound(req.params.dev_id);
  }
  res.send(device);
});

const getDeviceByDevEui = catchAsync(async (req, res) => {
  const device = await deviceService.getDeviceByDevEui(req.params.dev_eui);
  if (!device) {
    throwDeviceNotFound(req.params.dev_eui);
  }
  res.send(device);
});

const getDevices = catchAsync(async (req, res) => {
  const devices = await deviceService.getDevices();
  res.send(devices);
});

const getDevicesByAppId = catchAsync(async (req, res) => {
  const application = await applicationService.getApplicationByAppId(req.params.app_id);
  if (!application) {
    throwApplicationNotFound(req.params.app_id);
  }
  const devices = await deviceService.getDevicesByAppId(req.params.app_id);
  res.send(devices);
});

const getDevicesByDeviceProfile = catchAsync(async (req, res) => {
  const deviceProfile = await deviceProfileService.getDeviceProfileByName(req.params.device_profile);
  if (!deviceProfile) {
    throwDeviceProfileNotFound(req.params.device_profile);
  }
  const devices = await deviceService.getDevicesByDeviceProfile(req.params.device_profile);
  res.send(devices);
});

const getDevicesByNetworkProfile = catchAsync(async (req, res) => {
  const networkProfile = await networkProfileService.getNetworkProfileByName(req.params.network_profile);
  if (!networkProfile) {
    throwNetworkProfileNotFound(req.params.network_profile);
  }
  const devices = await deviceService.getDevicesByNetworkProfile(req.params.network_profile);
  res.send(devices);
});

const deleteDeviceGroup = catchAsync(async (req, res) => {
  const deviceIds = req.body.devices;
  const result = {
    deletedDevices: [],
    failedDevices: [],
  };
  for (let devId of deviceIds) {
    // DB 확인
    const oldDevice = await deviceService.getDeviceByDevId(devId);
    if (!oldDevice) {
      result.failedDevices.push({
        dev_id: devId,
        error: {
          error: 'bad_request',
          error_description: `id(${devId}) is not found`,
        },
      });
    } else {
      try {
        await lnsService.deleteDevice(oldDevice.app_eui, oldDevice.dev_eui);
      } catch (e) {
        if (e.response.status !== httpStatus.NOT_FOUND) {
          result.failedDevices.push({
            dev_id: devId,
            error: {
              error: 'bad_request',
              error_description: `remove of device (${devId}) is failed. (lns)`,
            },
          });
          continue;
        }
      }
      try {
        await edgexService.deleteDeviceByName(oldDevice.dev_id);
      } catch (e) {
        if (e.response.status !== httpStatus.NOT_FOUND) {
          result.failedDevices.push({
            dev_id: devId,
            error: {
              error: 'bad_request',
              error_description: `remove of device (${devId}) is failed. (edgex)`,
            },
          });
          continue;
        }
      }
      try {
        await deviceService.deleteDeviceByDevId(devId);
        result.deletedDevices.push(devId);
      } catch (e) {
        result.failedDevices.push({
          dev_id: devId,
          error: {
            error: 'bad_request',
            error_description: `remove of device (${devId}) is failed.`,
          },
        });
      }
    }
  }

  res.send(result);
});

const checkDeviceAndResource = async (devId, resourceName) => {
  const device = await deviceService.getDeviceByDevId(devId);
  if (!device) {
    throwDeviceNotFound(devId);
  }
  const deviceProfile = await deviceProfileService.getDeviceProfileByName(device.device_profile);
  if (!deviceProfile) {
    throwDeviceProfileNotFound(device.device_profile);
  }
  const resourceFound = deviceProfile.resources.find((resource) => resource.name == resourceName);
  if (!resourceFound) {
    throwDeviceResourceNotFound(resourceName);
  }
};

const checkDeviceAndCommand = async (devId, commandName) => {
  const device = await deviceService.getDeviceByDevId(devId);
  if (!device) {
    throwDeviceNotFound(devId);
  }
  const deviceProfile = await deviceProfileService.getDeviceProfileByName(device.device_profile);
  if (!deviceProfile) {
    throwDeviceProfileNotFound(device.device_profile);
  }
  const resourceFound = deviceProfile.commands.find((command) => command.name == commandName);
  if (!resourceFound) {
    throwDeviceCommandNotFound(commandName);
  }
};

module.exports = {
  addDevice,
  addDeviceGroup,
  deleteDeviceByDevId,
  updateDeviceByDevId,
  getDeviceByDevId,
  getDeviceByDevEui,
  getDevices,
  getDevicesByAppId,
  getDevicesByDeviceProfile,
  getDevicesByNetworkProfile,
  deleteDeviceGroup,
  throwDeviceNotFound,
  throwDeviceResourceNotFound,
  throwDeviceCommandNotFound,
  checkDeviceAndResource,
  checkDeviceAndCommand,
};
