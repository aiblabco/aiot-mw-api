const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { roles } = require('../../../config/roles');
const { deviceValidation, deviceCommandValidation } = require('../../../validations');
const { deviceController, deviceCommandController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(roles.ROLE_USER), validate(deviceValidation.addDevice), deviceController.addDevice)
  .get(auth(roles.ROLE_USER), validate(deviceValidation.getDevices), deviceController.getDevices);
router
  .route('/devid/:dev_id')
  .get(auth(roles.ROLE_USER), validate(deviceValidation.getDeviceByDevId), deviceController.getDeviceByDevId)
  .delete(auth(roles.ROLE_USER), validate(deviceValidation.deleteDeviceByDevId), deviceController.deleteDeviceByDevId)
  .put(auth(roles.ROLE_USER), validate(deviceValidation.updateDeviceByDevId), deviceController.updateDeviceByDevId);
router
  .route('/group')
  .post(auth(roles.ROLE_USER), validate(deviceValidation.addDeviceGroup), deviceController.addDeviceGroup)
  .delete(auth(roles.ROLE_USER), validate(deviceValidation.deleteDeviceGroup), deviceController.deleteDeviceGroup);

router
  .route('/deveui/:dev_eui')
  .get(auth(roles.ROLE_USER), validate(deviceValidation.getDeviceByDevEui), deviceController.getDeviceByDevEui);
router
  .route('/appid/:app_id')
  .get(auth(roles.ROLE_USER), validate(deviceValidation.getDevicesByAppId), deviceController.getDevicesByAppId);
router
  .route('/device_profile/:device_profile')
  .get(
    auth(roles.ROLE_USER),
    validate(deviceValidation.getDevicesByDeviceProfile),
    deviceController.getDevicesByDeviceProfile,
  );
router
  .route('/network_profile/:network_profile')
  .get(
    auth(roles.ROLE_USER),
    validate(deviceValidation.getDevicesByNetworkProfile),
    deviceController.getDevicesByNetworkProfile,
  );

router
  .route('/devid/:dev_id/command/:command_name')
  .post(auth(roles.ROLE_USER), validate(deviceCommandValidation.sendCommand), deviceCommandController.sendCommand);

module.exports = router;
