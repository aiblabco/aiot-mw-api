const mqtt = require('mqtt');
const lnsService = require('./lns.service');
const config = require('../config/config');
const logger = require('../config/logger');
const edgexService = require('./edgex.service');

module.exports = {
  bootstrap: async (callback = () => {}) => {
    const successFn = () => {
      callback(true);
    };
    const failFn = () => {
      callback(false);
    };
    try {
      let result;
      result = await edgexService.coreDataPing();
      logger.info(`edgexService.coreDataPing() =  ${JSON.stringify(result)}`);

      result = await edgexService.coreMetadataPing();
      logger.info(`edgexService.coreMetadataPing() =  ${JSON.stringify(result)}`);

      result = await edgexService.commandPing();
      logger.info(`edgexService.commandPing() =  ${JSON.stringify(result)}`);

      result = await lnsService.init();
      logger.info(`lnsService.init() =  ${JSON.stringify(result)}`);

      //! mqtt - start
      const mqttPingResult = (client, resultFn) => {
        client.end();
        resultFn();
      };
      const mqttClient = mqtt.connect({
        host: config.edgeXHost,
        port: config.edgeXDeviceMqttPort,
        clientId: config.edgeXDeviceMqttClientId,
      });
      mqttClient.on('connect', () => {
        if (mqttClient.pingResp) {
          logger.info('mqtt is alive.');
          mqttPingResult(mqttClient, successFn);
        } else {
          logger.info('mqtt is not available.');
          mqttPingResult(mqttClient, failFn);
        }
      });
      mqttClient.on('error', () => {
        mqttPingResult(mqttClient, failFn);
      });
      //! mqtt - end
    } catch (e) {
      failFn();
    }
  },
};
