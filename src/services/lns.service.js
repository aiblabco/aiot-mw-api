const axios = require('axios');
const qs = require('qs');

const config = require('../config/config');

const lnsAuthBaseUrl = `http://${config.lnsHost}:${config.lnsAuthPort}`;
const lnsApiBaseUrl = `http://${config.lnsHost}:${config.lnsApiPort}/api/kaia`;

let lnsTokenData = {};

async function loadLnsToken() {
  const result = await axios.post(
    `${lnsAuthBaseUrl}/oauth/token`,
    qs.stringify({
      username: config.lnsUsername,
      password: config.lnsPassword,
      grant_type: 'password',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${config.lnsAuthorizationBasic}`,
      },
    },
  );

  lnsTokenData = result.data;

  return lnsTokenData;
}

async function getAppList() {
  const result = await axios.get(`${lnsApiBaseUrl}/applications`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-token': `${lnsTokenData.access_token}`,
    },
  });

  return result.data;
}

module.exports = {
  init: async () => {
    return await loadLnsToken();
  },
  getToken: async () => {
    try {
      await getAppList();
    } catch (e) {
      await loadLnsToken();
    }
    return lnsTokenData;
  },
  //! APP
  addApp: async (app) => {
    const result = await axios.post(
      `${lnsApiBaseUrl}/applications`,
      {
        app_id: app.app_id,
        description: app.description,
        default_priority: config.appDefaultPriority,
        ch_access_type: config.appChAccessType,
        default_ifs: config.appDefaultIfs,
        min_cw: config.appMinCw,
        max_cw: config.appMaxCw,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-token': `${lnsTokenData.access_token}`,
        },
      },
    );

    return result.data;
  },
  getAppList,
  getApp: async (appEui) => {
    const result = await axios.get(`${lnsApiBaseUrl}/applications/${appEui}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-token': `${lnsTokenData.access_token}`,
      },
    });

    return result.data;
  },
  deleteApp: async (appEui) => {
    const result = await axios.delete(`${lnsApiBaseUrl}/applications/${appEui}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-token': `${lnsTokenData.access_token}`,
      },
    });

    return result.data;
  },
  //! DEVICE
  addDevice: async (appEui, device) => {
    const result = await axios.post(`${lnsApiBaseUrl}/applications/${appEui}/devices`, device, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-token': `${lnsTokenData.access_token}`,
      },
    });

    return result.data;
  },
  updateDevice: async (appEui, devEui, device) => {
    const result = await axios.put(`${lnsApiBaseUrl}/applications/${appEui}/devices/${devEui}`, device, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-token': `${lnsTokenData.access_token}`,
      },
    });

    return result.data;
  },
  getAppDeviceList: async (appEui) => {
    const result = await axios.get(`${lnsApiBaseUrl}/applications/${appEui}/devices`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-token': `${lnsTokenData.access_token}`,
      },
    });

    return result.data;
  },
  getAppDevice: async (appEui, devEui) => {
    const result = await axios.get(`${lnsApiBaseUrl}/applications/${appEui}/devices/${devEui}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-token': `${lnsTokenData.access_token}`,
      },
    });

    return result.data;
  },
  deleteDevice: async (appEui, devEui) => {
    const result = await axios.delete(`${lnsApiBaseUrl}/applications/${appEui}/devices/${devEui}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-token': `${lnsTokenData.access_token}`,
      },
    });

    return result.data;
  },
};
