const Joi = require('joi');

const validDevIdSchema = Joi.string()
  .regex(/^[a-zA-Z0-9-_]{5,16}$/)
  .required();

const deviceValidation = Joi.object().keys({
  dev_id: validDevIdSchema,
  dev_eui: Joi.string().allow(null, ''),
  app_id: Joi.string().required(),
  dev_addr: Joi.string().allow(null, ''),
  enabled: Joi.number().required(),
  description: Joi.string().allow(null, ''),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  altitude: Joi.number().required(),
  device_profile: Joi.string().required(),
  network_profile: Joi.string().required(),
});

const addDevice = {
  body: deviceValidation,
};

const addDeviceGroup = {
  body: Joi.object().keys({
    devices: Joi.array().items(deviceValidation),
  }),
};

const deleteDeviceByDevId = {
  params: Joi.object().keys({
    dev_id: Joi.string().required(),
  }),
};

const deleteDeviceGroup = {
  body: Joi.object().keys({
    devices: Joi.array().items(Joi.string()).required(),
  }),
};

const updateDeviceByDevId = {
  params: Joi.object().keys({
    dev_id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    dev_addr: Joi.string().allow(null, ''),
    enabled: Joi.number().required(),
    description: Joi.string().allow(null, ''),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    altitude: Joi.number().required(),
  }),
};

const getDeviceByDevId = {
  params: Joi.object().keys({
    dev_id: Joi.string().required(),
  }),
};

const getDeviceByDevEui = {
  params: Joi.object().keys({
    dev_eui: Joi.string().required(),
  }),
};
const getDevicesByAppId = {
  params: Joi.object().keys({
    app_id: Joi.string().required(),
  }),
};
const getDevicesByDeviceProfile = {
  params: Joi.object().keys({
    device_profile: Joi.string().required(),
  }),
};
const getDevicesByNetworkProfile = {
  params: Joi.object().keys({
    network_profile: Joi.string().required(),
  }),
};

const getDevices = {};

module.exports = {
  addDevice,
  addDeviceGroup,
  getDeviceByDevId,
  deleteDeviceByDevId,
  deleteDeviceGroup,
  updateDeviceByDevId,
  getDevices,
  getDeviceByDevEui,
  getDevicesByAppId,
  getDevicesByDeviceProfile,
  getDevicesByNetworkProfile,
};
