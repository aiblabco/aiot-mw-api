const { getDb } = require('./sqlite-db');

const createOne = async (tokenData = {}) => {
  return await getDb().run(
    `
		INSERT INTO token
		(
			user_id,
			type,
			expires,
			token,
			tokenhash,
			blacklisted
		)
		values (?, ?, ?, ?, ?, ?)
	  `,
    [
      tokenData.user_id, //
      tokenData.type,
      tokenData.expires,
      tokenData.token,
      tokenData.tokenHash,
      tokenData.blacklisted,
    ]
  );
};

const deleteByToken = async (tokenHash, type, blacklisted = false) => {
  return await getDb().run(
    `
		DELETE FROM token		  
		 WHERE
			tokenhash = ? 
			AND type = ?
			AND blacklisted = ?		  
		`,
    [tokenHash, type, blacklisted ? 1 : 0]
  );
};

const deleteAll = async (userId, type) => {
  return await getDb().all(
    `
			DELETE FROM token		  
		  WHERE
				user_id = ?
				AND type = ?
		  
		`,
    [userId, type]
  );
};

const selectOneById = async (tokenHash, type, userId, blacklisted = false) => {
  return await getDb().get(
    `
		SELECT
			user_id,
			type,
			expires,
			token,
			blacklisted
		FROM
			token
		WHERE
			tokenHash = ?
			AND type = ?
			AND user_id = ?
			AND blacklisted = ?		
	`,
    [tokenHash, type, userId, blacklisted ? 1 : 0]
  );
};

module.exports = {
  createOne,
  selectOneById,
  deleteByToken,
  deleteAll,
};
