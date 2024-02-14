const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const commonRoute = require('./common.route');
const applicationRoute = require('./application.route');
const networkProfileRoute = require('./network-profile.route');
const deviceRoute = require('./device.route');
const deviceProfileRoute = require('./device-profile.route');
const objectTypeRoute = require('./object-type.route');
const deviceDataRoute = require('./device-data.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: commonRoute,
  },
  {
    path: '/oauth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/application',
    route: applicationRoute,
  },
  {
    path: '/profile/network',
    route: networkProfileRoute,
  },
  {
    path: '/profile/device',
    route: deviceProfileRoute,
  },
  {
    path: '/device',
    route: deviceRoute,
  },
  {
    path: '/profile/device/objectType',
    route: objectTypeRoute,
  },
  {
    path: '/data',
    route: deviceDataRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
module.exports = router;
