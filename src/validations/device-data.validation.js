const Joi = require('joi');
const getDeviceResourceRecentData = {
  params: Joi.object().keys({
    dev_id: Joi.string().required(),
    resource_name: Joi.string().required(),
    count: Joi.number().required(),
  }),
};
const getDeviceResourceHistoryData = {
  params: Joi.object().keys({
    dev_id: Joi.string().required(),
    resource_name: Joi.string().required(),
    from: Joi.string().length(14).required(),
    to: Joi.string().length(14).required(),
  }),
};

module.exports = {
  getDeviceResourceRecentData,
  getDeviceResourceHistoryData,
};
