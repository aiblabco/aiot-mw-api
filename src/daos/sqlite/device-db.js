const moment = require('moment');
const { getDb } = require('./sqlite-db');

const createOne = async (deviceData = {}) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  return await getDb().run(
    `
		INSERT INTO device
		(
      dev_id,
      dev_eui,
      app_id,
      dev_addr,
      enabled,
      description,
      latitude,
      longitude,
      altitude,
      device_profile,
      network_profile,
      created_at
		)
		values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	  `,
    [
      deviceData.dev_id,
      deviceData.dev_eui,
      deviceData.app_id,
      deviceData.dev_addr,
      deviceData.enabled,
      deviceData.description,
      deviceData.latitude,
      deviceData.longitude,
      deviceData.altitude,
      deviceData.device_profile,
      deviceData.network_profile,
      now,
    ],
  );
};

const updateByDevId = async (devId, newDeviceData) => {
  return await getDb().run(
    `
		UPDATE device
		SET            
      enabled = ?,
      description = ?,
      latitude = ?,
      longitude = ?,
      altitude = ?
		WHERE
      dev_id = ?

		`,
    [
      newDeviceData.enabled,
      newDeviceData.description,
      newDeviceData.latitude,
      newDeviceData.longitude,
      newDeviceData.altitude,
      devId,
    ],
  );
};

const setDisabled = async (devId) => {
  return await getDb().run(
    `
		UPDATE device
		SET                 
      enabled = false
		WHERE
      dev_id = ?
		`,
    [devId],
  );
};

const deleteByDevId = async (devId) => {
  return await getDb().run(
    `
      DELETE FROM device
      WHERE
        dev_id = ?

		`,
    [devId],
  );
};

const selectByDevId = async (devId) => {
  return await getDb().get(
    `
		SELECT
     *
		FROM
			device
		WHERE
			dev_id = ?
	`,
    [devId],
  );
};

const selectByDevEui = async (devEui) => {
  return await getDb().get(
    `
		SELECT
     *
		FROM
			device
		WHERE
			dev_eui = ?
	`,
    [devEui],
  );
};

const selectAll = async () => {
  return await getDb().all(
    `
      SELECT
        *
      FROM
        device
    `,
  );
};

const selectAllByAppId = async (appId) => {
  return await getDb().all(
    `
      SELECT
        *
      FROM
        device
      WHERE
        app_id = ?
    `,
    [appId],
  );
};

const selectAllByDeviceProfile = async (deviceProfile) => {
  return await getDb().all(
    `
      SELECT
        *
      FROM
        device
      WHERE
        device_profile = ?
    `,
    [deviceProfile],
  );
};

const selectAllByNetworkProfile = async (networkProfile) => {
  return await getDb().all(
    `
      SELECT
        *
      FROM
        device
      WHERE
        network_profile = ?
    `,
    [networkProfile],
  );
};

module.exports = {
  createOne,
  updateByDevId,
  deleteByDevId,
  selectByDevId,
  selectByDevEui,
  selectAll,
  setDisabled,
  selectAllByAppId,
  selectAllByDeviceProfile,
  selectAllByNetworkProfile,
};
