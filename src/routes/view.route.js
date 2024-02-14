const express = require('express');
const { roles } = require('../config/roles');
const { authService, tokenService } = require('../services');

const router = express.Router();

router.route('/').get((req, res) => {
  res.redirect('/login');
});

router
  .route('/login')
  .get((req, res) => {
    res.render('login.ejs');
  })
  .post(async (req, res) => {
    try {
      const user = await authService.loginUser(req.body.user_id, req.body.password);
      if (user.role !== roles.ROLE_ADMIN) {
        return res.redirect('/login?error=not_admin');
      }
      const tokens = await tokenService.generateAuthTokens(user);
      res.cookie('access_token', tokens.access_token);
      res.redirect('/user');
    } catch (e) {
      res.redirect('/login?error=login_fail');
    }
  });

router.route('/user').get((req, res) => {
  res.render('user.ejs', { active: 'user' });
});
router.route('/application').get((req, res) => {
  res.render('application.ejs', { active: 'application' });
});
router.route('/network-profile').get((req, res) => {
  res.render('network-profile.ejs', { active: 'network-profile' });
});
router.route('/device-profile').get((req, res) => {
  res.render('device-profile.ejs', { active: 'device-profile' });
});
router.route('/object-type').get((req, res) => {
  res.render('object-type.ejs', { active: 'object-type' });
});
router.route('/device').get((req, res) => {
  res.render('device.ejs', { active: 'device' });
});

module.exports = router;
