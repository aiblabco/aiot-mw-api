const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { roles } = require('../../../config/roles');
const { deviceDataValidation } = require('../../../validations');
const { deviceDataController } = require('../../../controllers');

const router = express.Router();

router
  .route('/recent/:dev_id/:resource_name/:count')
  .get(
    auth(roles.ROLE_USER),
    validate(deviceDataValidation.getDeviceResourceRecentData),
    deviceDataController.getDeviceResourceRecentData,
  );
router
  .route('/history/:dev_id/:resource_name/:from/:to')
  .get(
    auth(roles.ROLE_USER),
    validate(deviceDataValidation.getDeviceResourceHistoryData),
    deviceDataController.getDeviceResourceHistoryData,
  );

module.exports = router;
