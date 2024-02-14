const os = require('os');
const moment = require('moment');
const config = require('../config/config');

const startDate = `${moment().format('YYMMDDHHmmss')}`;

module.exports = {
  ping: async (req, res) => {
    res.send('pong');
  },
  info: async (req, res) => {
    res.json({
      edgemwid: config.aiotmwEdgemwId,
      title: config.aiotmwTitle,
      description: config.aiotmwDescription,
      version: config.aiotmwVersion,
      start_date: startDate,
      protocol: config.aiotmwProtocol,
      address: config.aiotmwAddress,
      port: config.aiotmwPort,
      path: config.aiotmwPath,
      os: `${os.version()}(${os.platform()}, ${os.release()})`,
    });
  },
};
