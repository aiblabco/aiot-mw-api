const express = require('express');
const validate = require('../../../middlewares/validate');
const authValidation = require('../../../validations/auth.validation');
const authController = require('../../../controllers/auth.controller');
const auth = require('../../../middlewares/auth');
const { roles } = require('../../../config/roles');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증관리
 */

router.post('/token', validate(authValidation.login), authController.token);
router.get('/token/kaia', authController.getLnsToken);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh_token', auth(roles.ROLE_USER), validate(authValidation.refreshTokens), authController.refreshToken);
router.post('/change-password', validate(authValidation.changePassword), authController.changePassword);

module.exports = router;
