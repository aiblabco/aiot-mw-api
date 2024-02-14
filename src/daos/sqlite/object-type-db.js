const moment = require('moment');
const { getDb } = require('./sqlite-db');

const createOne = async (objectTypeData = {}) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  return await getDb().run(
    `
		INSERT INTO object_type
		(
      name,
      object_properties,
      created_at
		)
		values (?, ?, ?)
	  `,
    [
      objectTypeData.name,
      objectTypeData.object_properties,      
      now,
    ],
  );
};

const selectAll = async () => {
  return await getDb().all(
    `
      SELECT
        name,
        object_properties
      FROM
       object_type
    `,
  );
};

const updateByName = async (name, newObjectTypeData) => {
  return await getDb().run(
    `
		UPDATE object_type
		SET      
      object_properties  = ?
		WHERE
      name = ?

		`,
    [      
      newObjectTypeData.object_properties,
      name
    ],
  );
};

const deleteByName = async (name) => {
  return await getDb().run(
    `
      DELETE FROM object_type
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
      object_properties
    FROM
      object_type
		WHERE
			name = ?
	`,
    [name],
  );
};

module.exports = {
  createOne,
  selectAll,
  updateByName,
  deleteByName,
  selectByName
};
