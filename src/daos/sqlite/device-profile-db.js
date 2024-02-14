const moment = require('moment');
const { getDb } = require('./sqlite-db');

const createOne = async (deviceProfileData = {}) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  return await getDb().run(
    `
		INSERT INTO device_profile
		(

      name,
      manufacturer,
      description,
      model,
      labels,
      resources,
      commands,
      created_at
		)
		values (?, ?, ?, ?, ?, ?, ?, ?)
	  `,
    [
      deviceProfileData.name,
      deviceProfileData.manufacturer,
      deviceProfileData.description,
      deviceProfileData.model,
      deviceProfileData.labels,
      deviceProfileData.resources,
      deviceProfileData.commands,
      now,
    ],
  );
};

const updateByName = async (name, newDeviceProfileData) => {
  return await getDb().run(
    `
		UPDATE device_profile
		SET
      manufacturer = ?,
      description = ?,
      model = ?,
      labels = ?,
      resources = ?,
      commands = ?
		WHERE
      name = ?

		`,
    [
      newDeviceProfileData.manufacturer,
      newDeviceProfileData.description,
      newDeviceProfileData.model,
      newDeviceProfileData.labels,
      newDeviceProfileData.resources,
      newDeviceProfileData.commands,
      name,
    ],
  );
};

const deleteByName = async (name) => {
  return await getDb().run(
    `
      DELETE FROM device_profile
      WHERE
        name = ?

		`,
    [name],
  );
};

const selectByName = async (name) => {
  return await getDb().get(
    `
		SELECT
      name,
      manufacturer,
      description,
      model,
      labels,
      resources,
      commands
		FROM
    device_profile
		WHERE
      name = ?
    LIMIT 1
	`,
    [name],
  );
};

const selectAll = async () => {
  return await getDb().all(
    `
      SELECT
        name,
        manufacturer,
        description,
        model,
        labels,
        resources,
        commands
      FROM
      device_profile
    `,
  );
};

module.exports = {
  createOne,
  updateByName,
  deleteByName,
  selectByName,
  selectAll,
};
