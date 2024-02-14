const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');
const md5 = require('md5');
const { open } = require('sqlite');

const dbPath = path.resolve(__dirname, './db/data.db');

let db = null;

(async () => {
  // open the database
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  const createUserTable = `
  CREATE TABLE IF NOT EXISTS user (    
    user_id TEXT UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT "ROLE_USER",
    created_at TEXT
  );
`;
  const createTokenTable = `
  CREATE TABLE IF NOT EXISTS token (
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    expires TEXT NOT NULL,
    token TEXT NOT NULL,
    tokenhash TEXT NOT NULL,
    blacklisted TEXT NOT NULL
  );
`;

  const createApplicationTable = `
  CREATE TABLE IF NOT EXISTS application (    
    app_id TEXT UNIQUE,
    app_eui TEXT,
    app_type TEXT NOT NULL,
    protocol TEXT,
    address TEXT NOT NULL,
    port INTEGER NOT NULL,
    path TEXT,
    username TEXT,
    password TEXT,
    description TEXT,
    created_at TEXT
  );
`;

  const createNetworkProfileTable = `
  CREATE TABLE IF NOT EXISTS network_profile (
    name TEXT UNIQUE,
    channel_plan TEXT NOT NULL,
    lorawan_class TEXT NOT NULL,
    lorawan_version TEXT,
    activation_type TEXT,
    app_s_key TEXT,
    nwk_s_key TEXT,
    app_key TEXT,
    created_at TEXT
  );
`;

  const createDeviceTable = `
  CREATE TABLE IF NOT EXISTS device (
    dev_id TEXT UNIQUE,
    dev_eui TEXT UNIQUE,
    app_id TEXT,
    dev_addr TEXT,
    enabled INTEGER,
    description TEXT,
    latitude REAL,
    longitude REAL,
    altitude INTEGER,
    device_profile TEXT,
    network_profile TEXT,
    created_at TEXT
  );
`;

  const createDeviceProfileTable = `
  CREATE TABLE IF NOT EXISTS device_profile (
    name TEXT UNIQUE,
    manufacturer TEXT NOT NULL,
    description TEXT NOT NULL,
    model TEXT,
    labels TEXT,
    resources TEXT,
    commands TEXT,    
    created_at TEXT
  );
`;

  const createObjectType = `
  CREATE TABLE IF NOT EXISTS object_type (    
    name TEXT UNIQUE,
    object_properties TEXT NOT NULL,
    created_at TEXT
  );
`;

  await db.run(createUserTable);
  await db.run(createTokenTable);
  await db.run(createApplicationTable);
  await db.run(createNetworkProfileTable);
  await db.run(createDeviceTable);
  await db.run(createObjectType);
  await db.run(createDeviceProfileTable);

  try {
    const createDefaultAdmin = `
  INSERT INTO user
		(
			user_id,
			name,
			password,
			role,
      created_at
		)
		values ('admin', 'admin', '${md5('1234')}', 'ROLE_ADMIN', '${moment().format('YYYY-MM-DD HH:mm:ss')}')
`; // TODO: 어드민 정보 환경변수 처리 필요
    await db.run(createDefaultAdmin);
  } catch (e) {
    console.log(e.message);
  }
})();

module.exports = {
  getDb() {
    return db;
  },
};
