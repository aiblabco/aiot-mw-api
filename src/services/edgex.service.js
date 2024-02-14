const axios = require('axios');

const config = require('../config/config');

const edgeXCoreDataBaseUrl = `http://${config.edgeXHost}:${config.edgeXCoreDataPort}${config.edgeXBasePath}`;
const edgeXCoreMetadataBaseUrl = `http://${config.edgeXHost}:${config.edgeXCoreMetadataPort}${config.edgeXBasePath}`;
const edgeXCommandBaseUrl = `http://${config.edgeXHost}:${config.edgeXCommandPort}${config.edgeXBasePath}`;

const xCorrelationId = config.edgeXXCorrelationId;

module.exports = {
  coreDataPing: async () => {
    const result = await axios.get(`${edgeXCoreDataBaseUrl}/ping`);
    return result.data;
  },

  coreMetadataPing: async () => {
    const result = await axios.get(`${edgeXCoreMetadataBaseUrl}/ping`);
    return result.data;
  },
  commandPing: async () => {
    const result = await axios.get(`${edgeXCommandBaseUrl}/ping`);
    return result.data;
  },
  // Device Profile - begin
  addDeviceProfile: async (deviceProfile) => {
    const result = await axios.post(`${edgeXCoreMetadataBaseUrl}/deviceprofile`, deviceProfile, {
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': `${xCorrelationId}`,
      },
    });

    return result.data;
  },
  updateDeviceProfile: async (deviceProfile) => {
    const result = await axios.put(`${edgeXCoreMetadataBaseUrl}/deviceprofile`, deviceProfile, {
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': `${xCorrelationId}`,
      },
    });

    return result.data;
  },
  getDeviceProfileByName: async (profileName) => {
    const result = await axios.get(`${edgeXCoreMetadataBaseUrl}/deviceprofile/name/${profileName}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': `${xCorrelationId}`,
      },
    });

    return result.data;
  },
  deleteDeviceProfileByName: async (profileName) => {
    const result = await axios.delete(`${edgeXCoreMetadataBaseUrl}/deviceprofile/name/${profileName}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': `${xCorrelationId}`,
      },
    });

    return result.data;
  },
  // Device Profile - end

  // Device - begin
  addDevice: async (device) => {
    const result = await axios.post(`${edgeXCoreMetadataBaseUrl}/device`, device, {
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': `${xCorrelationId}`,
      },
    });
    return result.data;
  },
  updateDevice: async (device) => {
    const result = await axios.patch(`${edgeXCoreMetadataBaseUrl}/device`, device, {
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': `${xCorrelationId}`,
      },
    });
    return result.data;
  },
  getDeviceByName: async (name) => {
    const result = await axios.get(`${edgeXCoreMetadataBaseUrl}/device/name/${name}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': `${xCorrelationId}`,
      },
    });
    return result.data;
  },
  deleteDeviceByName: async (name) => {
    const result = await axios.delete(`${edgeXCoreMetadataBaseUrl}/device/name/${name}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': `${xCorrelationId}`,
      },
    });
    return result.data;
  },
  // Device - end
  // Data - begin
  getDeviceResourceRecentData: async (deviceName, resourceName, count) => {
    const result = await axios.get(
      `${edgeXCoreDataBaseUrl}/reading/device/name/${deviceName}/resourceName/${resourceName}?limit=${count}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': `${xCorrelationId}`,
        },
      },
    );
    return result.data;
  },
  getDeviceResourceHistoryData: async (deviceName, resourceName, from, to, count = 1024) => {
    const result = await axios.get(
      `${edgeXCoreDataBaseUrl}/reading/device/name/${deviceName}/resourceName/${resourceName}/start/${from}/end/${to}?limit=${count}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': `${xCorrelationId}`,
        },
      },
    );
    return result.data;
  },
  // Data -end
  // Command - begin
  sendGetCommand: async (deviceName, commandName) => {
    const result = await axios.get(`${edgeXCommandBaseUrl}/device/name/${deviceName}/${commandName}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': `${xCorrelationId}`,
      },
    });
    return result.data;
  },
  sendPutCommand: async (deviceName, commandName, data) => {
    const result = await axios.put(`${edgeXCommandBaseUrl}/device/name/${deviceName}/${commandName}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': `${xCorrelationId}`,
      },
    });
    return result.data;
  },
  // Command - end
};
