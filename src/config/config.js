const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const fs = require('fs');

let envFilePath = '../../.env';
if (fs.existsSync(`${__dirname}/${envFilePath}.${process.env.NODE_ENV}`)) {
  envFilePath += `.${process.env.NODE_ENV}`;
}
dotenv.config({ path: path.join(__dirname, envFilePath) });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'local', 'test').required(),
    SERVICE_PROTOCOL: Joi.string().default('http'),
    SERVICE_HOST: Joi.string().default('localhost'),
    PORT: Joi.number().default(3000),

    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    EDGEX_HOST: Joi.string().default('localhost'),
    EDGEX_BASE_PATH: Joi.string().default('/api/v2'),
    EDGEX_CORE_DATA_PORT: Joi.number().default(3000),
    EDGEX_CORE_METADATA_PORT: Joi.number().default(3000),
    EDGEX_COMMAND_PORT: Joi.number().default(3000),
    EDGEX_DEVICE_MQTT_PORT: Joi.number().default(3000),
    EDGEX_DEVICE_MQTT_CLIENT_ID: Joi.string(),
    EDGEX_X_CORRELATION_ID: Joi.string(),
    LNS_HOST: Joi.string().default('localhost'),
    LNS_API_PORT: Joi.number().default(81),
    LNS_AUTH_PORT: Joi.number().default(3000),
    LNS_USERNAME: Joi.string(),
    LNS_PASSWORD: Joi.string(),
    LNS_AUTHORIZATION_BASIC: Joi.string(),
    AIOTMW_EDGEMWID: Joi.string(),
    AIOTMW_TITLE: Joi.string(),
    AIOTMW_DESCRIPTION: Joi.string(),
    AIOTMW_VERSION: Joi.string(),
    AIOTMW_PATH: Joi.string(),
    MQTT_SERVICE_NAME: Joi.string(),
    APP_DEFAULT_PRIORITY: Joi.number(),
    APP_CH_ACCESS_TYPE: Joi.string(),
    APP_DEFAULT_IFS: Joi.number(),
    APP_MIN_CW: Joi.number(),
    APP_MAX_CW: Joi.number(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  serviceProtocol: envVars.SERVICE_PROTOCOL,
  serviceHost: envVars.SERVICE_HOST,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  // for edgex
  edgeXHost: envVars.EDGEX_HOST,
  edgeXBasePath: envVars.EDGEX_BASE_PATH,
  edgeXCoreDataPort: envVars.EDGEX_CORE_DATA_PORT,
  edgeXCoreMetadataPort: envVars.EDGEX_CORE_METADATA_PORT,
  edgeXCommandPort: envVars.EDGEX_COMMAND_PORT,
  edgeXDeviceMqttPort: envVars.EDGEX_DEVICE_MQTT_PORT,
  edgeXDeviceMqttClientId: envVars.EDGEX_DEVICE_MQTT_CLIENT_ID,
  edgeXXCorrelationId: envVars.EDGEX_X_CORRELATION_ID,
  lnsHost: envVars.LNS_HOST,
  lnsApiPort: envVars.LNS_API_PORT,
  lnsAuthPort: envVars.LNS_AUTH_PORT,
  lnsUsername: envVars.LNS_USERNAME,
  lnsPassword: envVars.LNS_PASSWORD,
  lnsAuthorizationBasic: envVars.LNS_AUTHORIZATION_BASIC,
  aiotmwEdgemwId: envVars.AIOTMW_EDGEMWID,
  aiotmwTitle: envVars.AIOTMW_TITLE,
  aiotmwDescription: envVars.AIOTMW_DESCRIPTION,
  aiotmwVersion: envVars.AIOTMW_VERSION,
  aiotmwProtocol: envVars.SERVICE_PROTOCOL,
  aiotmwAddress: envVars.SERVICE_HOST,
  aiotmwPort: envVars.PORT,
  aiotmwPath: envVars.AIOTMW_PATH,
  mqttServiceName: envVars.MQTT_SERVICE_NAME,
  appDefaultPriority: envVars.APP_DEFAULT_PRIORITY,
  appChAccessType: envVars.APP_CH_ACCESS_TYPE,
  appDefaultIfs: envVars.APP_DEFAULT_IFS,
  appMinCw: envVars.APP_MIN_CW,
  appMaxCw: envVars.APP_MAX_CW,
};
