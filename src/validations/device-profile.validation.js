const Joi = require('joi');
const { validValueTypes } = require('./object-type.validation');

const validResourceTypes = ['Simple', 'Object', 'Binary'];
const validResourceReadWrite = ['R', 'RW', 'W'];
const validCommandReadWrite = ['R', 'W'];
const validObjectMediaTypes = ['application/json'];
const validMimeTypes = [
  'application/atom+xml',
  'application/ecmascript',
  'application/font-woff',
  'application/gzip',
  'application/javascript',
  'application/json',
  'application/ld+json',
  'application/msword',
  'application/octet-stream',
  'application/ogg',
  'application/pdf',
  'application/postscript',
  'application/rdf+xml',
  'application/rss+xml',
  'application/rtf',
  'application/vnd.apple.installer+xml',
  'application/vnd.mozilla.xul+xml',
  'application/vnd.ms-excel',
  'application/vnd.ms-fontobject',
  'application/vnd.ms-powerpoint',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/x-7z-compressed',
  'application/x-csh',
  'application/x-freearc',
  'application/x-sh',
  'application/x-shockwave-flash',
  'application/x-tar',
  'application/xhtml+xml',
  'application/xml',
  'application/zip',
  'audio/3gpp',
  'audio/3gpp2',
  'audio/aac',
  'audio/midi',
  'audio/mpeg',
  'audio/ogg',
  'audio/opus',
  'audio/wav',
  'audio/webm',
  'font/otf',
  'font/ttf',
  'font/woff2',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'text/calendar',
  'text/css',
  'text/csv',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/xml',
  'video/3gpp',
  'video/3gpp2',
  'video/mp2t',
  'video/mpeg',
  'video/ogg',
  'video/webm',
  'video/x-msvideo',
];

const resourceValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null, '').default(''),
  type: Joi.string()
    .valid(...validResourceTypes)
    .required(),
  value_type: Joi.string()
    .when('type', {
      is: 'Simple',
      then: Joi.string()
        .valid(...validValueTypes)
        .insensitive(),
    })
    .required(),
  read_write: Joi.string()
    .valid(...validResourceReadWrite)
    .required(),
  units: Joi.string().allow(null, '').default(''),
  media_type: Joi.string()
    .when('type', { is: 'Simple', then: Joi.valid('') })
    .when('type', { is: 'Object', then: Joi.valid(...validObjectMediaTypes) })
    .when('type', { is: 'Binary', then: Joi.valid(...validMimeTypes) })
    .required(),
});

const commandValidation = Joi.object({
  name: Joi.string().required(),
  read_write: Joi.string()
    .valid(...validCommandReadWrite)
    .required(),
  resources: Joi.array().items(Joi.string()).required(),
});

const addDeviceModel = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    manufacturer: Joi.string().required(),
    model: Joi.string().required(),
    description: Joi.string().allow(null, '').default(''),
    labels: Joi.array().required(),
    resources: Joi.array().required(),
    commands: Joi.array().required(),
  }),
};

const addDeviceProfile = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    manufacturer: Joi.string().required(),
    model: Joi.string().required(),
    description: Joi.string().allow(null, '').default(''),
    labels: Joi.array().required(),
    resources: Joi.array().items(resourceValidation).required(),
    commands: Joi.array().items(commandValidation).required(),
  }),
};

const deleteDeviceProfileByName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateDeviceProfileByName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
  body: Joi.object().keys({
    manufacturer: Joi.string().required(),
    model: Joi.string().required(),
    description: Joi.string().allow(null, '').default(''),
    labels: Joi.array().required(),
    resources: Joi.array().items(resourceValidation).required(),
    commands: Joi.array().items(commandValidation).required(),
  }),
};

const getDeviceProfileByName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getDeviceProfiles = {};

module.exports = {
  addDeviceModel,
  addDeviceProfile,
  getDeviceProfileByName,
  deleteDeviceProfileByName,
  updateDeviceProfileByName,
  getDeviceProfiles,
};
