const { deviceProfileDb } = require('../daos');

const addDeviceProfile = async (deviceProfileData) => {
  deviceProfileData.labels = JSON.stringify(deviceProfileData.labels);
  deviceProfileData.resources = JSON.stringify(deviceProfileData.resources);
  deviceProfileData.commands = JSON.stringify(deviceProfileData.commands);
  return await deviceProfileDb.createOne(deviceProfileData);
};

const updateDeviceProfileByName = async (name, newDeviceProfileData) => {
  newDeviceProfileData.labels = JSON.stringify(newDeviceProfileData.labels);
  newDeviceProfileData.resources = JSON.stringify(newDeviceProfileData.resources);
  newDeviceProfileData.commands = JSON.stringify(newDeviceProfileData.commands);
  return await deviceProfileDb.updateByName(name, newDeviceProfileData);
};

const deleteDeviceProfileByName = async (name) => {
  return await deviceProfileDb.deleteByName(name);
};

const getDeviceProfileByName = async (name) => {
  const deviceProfile = await deviceProfileDb.selectByName(name);
  if (deviceProfile) {
    deviceProfile.labels = JSON.parse(deviceProfile.labels);
    deviceProfile.resources = JSON.parse(deviceProfile.resources);
    deviceProfile.commands = JSON.parse(deviceProfile.commands);
  }
  return deviceProfile;
};

const getDeviceProfiles = async () => {
  const deviceProfiles = await deviceProfileDb.selectAll();
  deviceProfiles.forEach((deviceProfile) => {
    deviceProfile.labels = JSON.parse(deviceProfile.labels);
    deviceProfile.resources = JSON.parse(deviceProfile.resources);
    deviceProfile.commands = JSON.parse(deviceProfile.commands);
  });
  return deviceProfiles;
};

module.exports = {
  addDeviceProfile,
  updateDeviceProfileByName,
  deleteDeviceProfileByName,
  getDeviceProfileByName,
  getDeviceProfiles,
};
