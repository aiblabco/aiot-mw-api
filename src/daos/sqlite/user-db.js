const moment = require('moment');
const { getDb } = require('./sqlite-db');

const createOne = async (userData = {}) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  return await getDb().run(
    `
		INSERT INTO user
		(			
			user_id,
			name,
			password,			
			role,
      created_at	
		)
		values (?, ?, ?, ?, ?)
	  `,
    [userData.user_id, userData.name, userData.password, userData.role, now]
  );
};

const updateById = async (userId, newUserData) => {
  return await getDb().run(
    `
		UPDATE user
		SET
      name = ?,
      password = ?,            
      role = ?            
		WHERE
      user_id = ?
		  
		`,
    [newUserData.name, newUserData.password, newUserData.role, userId]
  );
};

const deleteById = async (userId) => {
  return await getDb().run(
    `
      DELETE FROM user		  
      WHERE
        user_id = ?
		  
		`,
    [userId]
  );
};

const selectById = async (userId) => {
  return await getDb().get(
    `
		SELECT
      user_id,
      password,
      name,
      role
		FROM
			user
		WHERE
			user_id = ?		
	`,
    [userId]
  );
};

const selectAll = async () => {
  return await getDb().all(
    `
      SELECT
        user_id,        
        name,
        role
      FROM
        user
    `
  );
};

module.exports = {
  createOne,
  updateById,
  deleteById,
  selectById,
  selectAll,
};
