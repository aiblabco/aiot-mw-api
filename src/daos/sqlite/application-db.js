const moment = require('moment');
const { getDb } = require('./sqlite-db');

const createOne = async (applicationData = {}) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  return await getDb().run(
    `
		INSERT INTO application
		(
      app_id,
      app_eui,
      app_type ,
      protocol,
      address,
      port,
      path,
      username,
      password,
      description,
      created_at
		)
		values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	  `,
    [
      applicationData.app_id,
      applicationData.app_eui,
      applicationData.app_type,
      applicationData.protocol,
      applicationData.address,
      applicationData.port,
      applicationData.path,
      applicationData.username,
      applicationData.password,
      applicationData.description,
      now,
    ],
  );
};

const selectAll = async () => {
  return await getDb().all(
    `
      SELECT
        app_id,
        app_eui,
        app_type ,
        protocol,
        address,
        port,
        path,
        username,
        password,
        description,
        created_at
      FROM
        application
    `,
  );
};

const updateByAppId = async (appId, newApplicationData) => {
  return await getDb().run(
    `
		UPDATE application
		SET      
      app_type  = ?,
      protocol = ?,
      address = ?,
      port = ?,
      path = ?,
      username = ?,
      password = ?,
      description = ?
		WHERE
      app_id = ?

		`,
    [
      newApplicationData.app_type,
      newApplicationData.protocol,
      newApplicationData.address,
      newApplicationData.port,
      newApplicationData.path,
      newApplicationData.username,
      newApplicationData.password,
      newApplicationData.description,
      appId,
    ],
  );
};

const deleteByAppId = async (appId) => {
  return await getDb().run(
    `
      DELETE FROM application
      WHERE
        app_id = ?

		`,
    [appId],
  );
};

const selectByAppId = async (appId) => {
  return await getDb().get(
    `
		SELECT
      app_id,
      app_eui,
      app_type ,
      protocol,
      address,
      port,
      path,
      username,
      password,
      description,
      created_at
		FROM
			application
		WHERE
			app_id = ?
	`,
    [appId],
  );
};

module.exports = {
  createOne,
  selectAll,
  updateByAppId,
  deleteByAppId,
  selectByAppId,
};
