const applicationDb = require('../daos/sqlite/application-db');

/**
 * Add a application
 * @param {Object} applicationData
 * @returns  {Object}
 */
const addApplication = async (applicationData) => {
  return await applicationDb.createOne(applicationData);
};

const getApplications = async () => {
  return await applicationDb.selectAll();
};

const updateApplicationByAppId = async (appId, newApplicationData) => {
  return await applicationDb.updateByAppId(appId, newApplicationData);
};

const deleteApplicationByAppId = async (appId) => {
  return await applicationDb.deleteByAppId(appId);
};

const getApplicationByAppId = async (appId) => {
  return await applicationDb.selectByAppId(appId);
};

module.exports = {
  addApplication,
  getApplications,
  updateApplicationByAppId,
  deleteApplicationByAppId,
  getApplicationByAppId,
};
