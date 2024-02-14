const Joi = require('joi');

const validAppIdSchema = Joi.string()
  .regex(/^[a-zA-Z0-9-_]{5,16}$/)
  .required();

const validAppTypes = ['MIN', 'OCF'];
const validProtocols = ['HTTP', 'MQTT'];

const addApplication = {
  body: Joi.object().keys({
    app_id: validAppIdSchema,
    app_type: Joi.string()
      .valid(...validAppTypes)
      .required(),
    protocol: Joi.string()
      .valid(...validProtocols)
      .required(),
    address: Joi.string().required(),
    port: Joi.number().required(),
    path: Joi.string().when('protocol', { is: 'HTTP', then: Joi.required(), otherwise: Joi.allow(null, '') }),
    username: Joi.string().when('protocol', { is: 'MQTT', then: Joi.required(), otherwise: Joi.allow(null, '') }),
    password: Joi.string().when('protocol', { is: 'MQTT', then: Joi.required(), otherwise: Joi.allow(null, '') }),
    description: Joi.string().allow(null, ''),
  }),
};

const deleteApplicationByAppId = {
  params: Joi.object().keys({
    app_id: Joi.string().required(),
  }),
};

const updateApplicationByAppId = {
  params: Joi.object().keys({
    app_id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    app_type: Joi.string()
      .valid(...validAppTypes)
      .required(),
    protocol: Joi.string()
      .valid(...validProtocols)
      .required(),
    address: Joi.string().required(),
    port: Joi.number().required(),
    path: Joi.string().when('protocol', { is: 'HTTP', then: Joi.required(), otherwise: Joi.allow(null, '') }),
    username: Joi.string().when('protocol', { is: 'MQTT', then: Joi.required(), otherwise: Joi.allow(null, '') }),
    password: Joi.string().when('protocol', { is: 'MQTT', then: Joi.required(), otherwise: Joi.allow(null, '') }),
    description: Joi.string().allow(null, ''),
  }),
};

const getApplicationByAppId = {
  params: Joi.object().keys({
    app_id: Joi.string().required(),
  }),
};

module.exports = {
  addApplication,
  getApplicationByAppId,
  deleteApplicationByAppId,
  updateApplicationByAppId,
};
