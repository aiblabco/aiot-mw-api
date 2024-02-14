const Joi = require('joi');
/*
 * Columns
  name,
  object_properties,
  created_at
*/
const validValueTypes = [
  'bool',
  'int8',
  'int64',
  'uint8',
  'uint64',
  'float32',
  'float64',
  'string',
  'boolarray',
  'int8array',
  'int64array',
  'uint8array',
  'uint64array',
  'float32array',
  'float64array',
];

const addObjectType = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    object_properties: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          value_type: Joi.string()
            .valid(...validValueTypes)
            .insensitive()
            .required(),
          units: Joi.string().allow(null, ''),
        }),
      )
      .required(),
  }),
};

const deleteObjectTypeByName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateObjectTypeByName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
  body: Joi.object().keys({
    object_properties: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          value_type: Joi.string()
            .valid(...validValueTypes)
            .insensitive()
            .required(),
          units: Joi.string().allow(null, ''),
        }),
      )
      .required(),
  }),
};

const getObjectTypeByName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

module.exports = {
  addObjectType,
  getObjectTypeByName,
  deleteObjectTypeByName,
  updateObjectTypeByName,
  validValueTypes,
};
