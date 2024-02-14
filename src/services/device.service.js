const deviceDb = require('../daos/sqlite/device-db');

const addDevice = async (newDeviceData) => {
  return await deviceDb.createOne(newDeviceData);
};

const updateDeviceByDevId = async (devId, newDeviceData) => {
  return await deviceDb.updateByDevId(devId, newDeviceData);
};

const deleteDeviceByDevId = async (devId) => {
  return await deviceDb.deleteByDevId(devId);
};

const getDeviceByDevId = async (devId) => {
  return await deviceDb.selectByDevId(devId);
};

const getDeviceByDevEui = async (devEui) => {
  return await deviceDb.selectByDevEui(devEui);
};

const getDevices = async () => {
  return await deviceDb.selectAll();
};

const getDevicesByAppId = async (appId) => {
  return await deviceDb.selectAllByAppId(appId);
};

const getDevicesByDeviceProfile = async (deviceProfile) => {
  return await deviceDb.selectAllByDeviceProfile(deviceProfile);
};

const getDevicesByNetworkProfile = async (networkProfile) => {
  return await deviceDb.selectAllByNetworkProfile(networkProfile);
};

const setDeviceDisabled = async (devId) => {
  return await deviceDb.setDisabled(devId);
};

module.exports = {
  addDevice,
  updateDeviceByDevId,
  deleteDeviceByDevId,
  getDeviceByDevId,
  getDeviceByDevEui,
  getDevices,
  getDevicesByAppId,
  getDevicesByDeviceProfile,
  getDevicesByNetworkProfile,
  setDeviceDisabled,
};
