const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { roles } = require('../../../config/roles');
const { deviceProfileValidation } = require('../../../validations');
const { deviceProfileController, deviceModelController } = require('../../../controllers');

const router = express.Router();

router
  .route('/model')
  .post(
    auth(roles.ROLE_USER),
    validate(deviceProfileValidation.addDeviceModel),
    deviceModelController.genDeviceProfileModel,
  );

router
  .route('/')
  .post(auth(roles.ROLE_USER), validate(deviceProfileValidation.addDeviceProfile), deviceProfileController.addDeviceProfile)
  .get(
    auth(roles.ROLE_USER),
    validate(deviceProfileValidation.getDeviceProfiles),
    deviceProfileController.getDeviceProfiles,
  );

router
  .route('/name/:name')
  .get(
    auth(roles.ROLE_USER),
    validate(deviceProfileValidation.getDeviceProfileByName),
    deviceProfileController.getDeviceProfileByName,
  )
  .delete(
    auth(roles.ROLE_USER),
    validate(deviceProfileValidation.deleteDeviceProfileByName),
    deviceProfileController.deleteDeviceProfileByName,
  )
  .put(
    auth(roles.ROLE_USER),
    validate(deviceProfileValidation.updateDeviceProfileByName),
    deviceProfileController.updateDeviceProfileByName,
  );

module.exports = router;
