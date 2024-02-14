const Joi = require('joi');
const sendCommand = {
  params: Joi.object().keys({
    dev_id: Joi.string().required(),
    command_name: Joi.string().required(),
  }),
  body: Joi.object().keys({
    method: Joi.string().valid('get', 'set').required(),
    parameter: Joi.object().when('method', { is: 'set', then: Joi.required(), otherwise: Joi.forbidden() }),
  }),
};

module.exports = {
  sendCommand,
};
