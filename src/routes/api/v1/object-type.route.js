const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { roles } = require('../../../config/roles');
const { objectTypeValidation } = require('../../../validations');
const { objectTypeController } = require('../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(roles.ROLE_USER), validate(objectTypeValidation.addObjectType), objectTypeController.addObjectType)
  .get(auth(roles.ROLE_USER), objectTypeController.getObjectTypes);
router
  .route('/name/:name')
  .get(auth(roles.ROLE_USER), validate(objectTypeValidation.getObjectTypeByName), objectTypeController.getObjectTypeByName)
  .delete(
    auth(roles.ROLE_USER),
    validate(objectTypeValidation.deleteObjectTypeByName),
    objectTypeController.deleteObjectTypeByName,
  )
  .put(
    auth(roles.ROLE_USER),
    validate(objectTypeValidation.updateObjectTypeByName),
    objectTypeController.updateObjectTypeByName,
  );

module.exports = router;
