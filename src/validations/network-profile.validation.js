const Joi = require('joi');
/*
 * Columns
  id,
  name,
  channel_plan,
  lorawan_class,
  lorawan_version,
  activation_type,
  app_s_key,
  nwk_s_key,
  app_key,
  created_at
*/
const addNetworkProfile = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    channel_plan: Joi.string().required(),
    lorawan_class: Joi.string().valid('A', 'B', 'C').required(),
    lorawan_version: Joi.string().allow(null, ''),
    activation_type: Joi.string().valid('ABP', 'OTAA').required(),
    app_s_key: Joi.string().when('activation_type', { is: 'ABP', then: Joi.required(), otherwise: Joi.allow(null, '') }),
    nwk_s_key: Joi.string().when('activation_type', { is: 'ABP', then: Joi.required(), otherwise: Joi.allow(null, '') }),
    app_key: Joi.string().when('activation_type', { is: 'OTAA', then: Joi.required(), otherwise: Joi.allow(null, '') }),
  }),
};

const deleteNetworkProfileByName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateNetworkProfileByName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
  body: Joi.object().keys({
    channel_plan: Joi.string().required(),
    lorawan_class: Joi.string().valid('A', 'B', 'C').required(),
    lorawan_version: Joi.string().allow(null, ''),
    activation_type: Joi.string().valid('ABP', 'OTAA').required(),
    app_s_key: Joi.string().when('activation_type', { is: 'ABP', then: Joi.required(), otherwise: Joi.allow(null, '') }),
    nwk_s_key: Joi.string().when('activation_type', { is: 'ABP', then: Joi.required(), otherwise: Joi.allow(null, '') }),
    app_key: Joi.string().when('activation_type', { is: 'OTAA', then: Joi.required(), otherwise: Joi.allow(null, '') }),
  }),
};

const getNetworkProfileByName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

module.exports = {
  addNetworkProfile,
  getNetworkProfileByName,
  deleteNetworkProfileByName,
  updateNetworkProfileByName,
};
