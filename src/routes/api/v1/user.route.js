const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const { userValidation } = require('../../../validations');
const { userController } = require('../../../controllers');
const { roles } = require('../../../config/roles');

const router = express.Router();

router
  .route('/')
  .post(auth(roles.ROLE_ADMIN), validate(userValidation.addUser), userController.addUser)
  .get(auth(roles.ROLE_ADMIN), validate(userValidation.getUsers), userController.getUsers);
router
  .route('/:user_id')
  .get(auth(roles.ROLE_ADMIN), validate(userValidation.getUser), userController.getUser)
  .delete(auth(roles.ROLE_ADMIN), validate(userValidation.deleteUser), userController.deleteUser)
  .put(auth(roles.ROLE_ADMIN), validate(userValidation.updateUser), userController.updateUser);

module.exports = router;
