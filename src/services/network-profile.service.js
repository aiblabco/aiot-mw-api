const networkProfileDb = require('../daos/sqlite/network-profile-db');

const addNetworkProfile = async (networkProfileData) => {  
  return await networkProfileDb.createOne(networkProfileData);
};

const updateNetworkProfileByName = async (name, newNetworkProfileData) => {
  return await networkProfileDb.updateByName(name, newNetworkProfileData);
};

const deleteNetworkProfileByName = async (name) => {
  return await networkProfileDb.deleteByName(name);
};

const getNetworkProfileByName = async (name) => {
  return await networkProfileDb.selectByName(name);
};

const getNetworkProfiles = async () => {
  return await networkProfileDb.selectAll();
};

module.exports = {
  addNetworkProfile,
  updateNetworkProfileByName,
  deleteNetworkProfileByName,
  getNetworkProfileByName,
  getNetworkProfiles,
};
