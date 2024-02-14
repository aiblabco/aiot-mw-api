const express = require('express');

const { commonController } = require('../../../controllers');

const router = express.Router();

router.get('/ping', commonController.ping);
router.get('/info', commonController.info);

module.exports = router;
