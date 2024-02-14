const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { roles } = require('../../../config/roles');
const { networkProfileValidation } = require('../../../validations');
const { networkProfileController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth(roles.ROLE_USER),
    validate(networkProfileValidation.addNetworkProfile),
    networkProfileController.addNetworkProfile,
  )
  .get(
    auth(roles.ROLE_USER),
    networkProfileController.getNetworkProfiles,
  );
router
  .route('/name/:name')
  .get(
    auth(roles.ROLE_USER),
    validate(networkProfileValidation.getNetworkProfileByName),
    networkProfileController.getNetworkProfileByName,
  )
  .delete(
    auth(roles.ROLE_USER),
    validate(networkProfileValidation.deleteNetworkProfileByName),
    networkProfileController.deleteNetworkProfileByName,
  )
  .put(
    auth(roles.ROLE_USER),
    validate(networkProfileValidation.updateNetworkProfileByName),
    networkProfileController.updateNetworkProfileByName,
  );

module.exports = router;
