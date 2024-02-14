const moment = require('moment');
const { getDb } = require('./sqlite-db');

const createOne = async (networkData = {}) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  return await getDb().run(
    `
		INSERT INTO network_profile
		(
      name,
      channel_plan,
      lorawan_class,
      lorawan_version,
      activation_type,
      app_s_key,
      nwk_s_key,
      app_key,
      created_at
		)
		values (?, ?, ?, ?, ?, ?, ?, ?, ?)
	  `,
    [
      networkData.name,
      networkData.channel_plan,
      networkData.lorawan_class,
      networkData.lorawan_version,
      networkData.activation_type,
      networkData.app_s_key,
      networkData.nwk_s_key,
      networkData.app_key,
      now,
    ]
  );
};

const updateByName = async (name, newNetworkData) => {
  return await getDb().run(
    `
		UPDATE network_profile
		SET
      channel_plan = ?,
      lorawan_class = ?,
      lorawan_version = ?,
      activation_type = ?,
      app_s_key = ?,
      nwk_s_key = ?,
      app_key = ?
		WHERE
      name = ?
		`,
    [
      newNetworkData.channel_plan,
      newNetworkData.lorawan_class,
      newNetworkData.lorawan_version,
      newNetworkData.activation_type,
      newNetworkData.app_s_key,
      newNetworkData.nwk_s_key,
      newNetworkData.app_key,
      name,
    ]
  );
};

const deleteByName = async (name) => {
  return await getDb().run(
    `
      DELETE FROM network_profile
      WHERE
        name = ?

		`,
    [name]
  );
};

const selectByName = async (name) => {
  return await getDb().get(
    `
		SELECT      
      name,
      channel_plan,
      lorawan_class,
      lorawan_version,
      activation_type,
      app_s_key,
      nwk_s_key,
      app_key,
      created_at
		FROM
      network_profile
		WHERE
      name = ?
    LIMIT 1
	`,
    [name]
  );
};

const selectAll = async () => {
  return await getDb().all(
    `
    SELECT      
      name,
      channel_plan,
      lorawan_class,
      lorawan_version,
      activation_type,
      app_s_key,
      nwk_s_key,
      app_key,
      created_at
    FROM
      network_profile
    `
  );
};

module.exports = {
  createOne,
  updateByName,
  deleteByName,
  selectByName,
  selectAll,
};
