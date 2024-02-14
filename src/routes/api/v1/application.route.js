const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { roles } = require('../../../config/roles');
const { applicationValidation } = require('../../../validations');
const { applicationController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(roles.ROLE_USER), validate(applicationValidation.addApplication), applicationController.addApplication)
  .get(auth(roles.ROLE_USER), applicationController.getApplications);
router
  .route('/appid/:app_id')
  .get(auth(roles.ROLE_USER), validate(applicationValidation.getApplicationByAppId), applicationController.getApplicationByAppId)
  .delete(auth(roles.ROLE_USER), validate(applicationValidation.deleteApplicationByAppId), applicationController.deleteApplicationByAppId)
  .put(auth(roles.ROLE_USER), validate(applicationValidation.updateApplicationByAppId), applicationController.updateApplicationByAppId);

module.exports = router;
