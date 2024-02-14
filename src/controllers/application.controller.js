const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { applicationService, lnsService } = require('../services');
const ApiError = require('../utils/ApiError');

const throwApplicationNotFound = (appId) => {
  throw new ApiError(httpStatus.NOT_FOUND, 'not_found', `the application '${appId}' is not found`);
};

const throwApplicationExist = (key) => {
  throw new ApiError(httpStatus.BAD_REQUEST, 'application_exist', `the application '${key}' is already exist`);
};

const addApplication = catchAsync(async (req, res) => {
  const reqApp = req.body;
  let lnsApp;
  try {
    lnsApp = (await lnsService.addApp(reqApp)).application;
  } catch (e) {
    if (e.response.status === httpStatus.UNPROCESSABLE_ENTITY) {
      const lnsAppList = (await lnsService.getAppList()).applications;
      lnsApp = lnsAppList.find((app) => app.app_id === reqApp.app_id);
    } else {
      throw e;
    }
  }
  if (!lnsApp) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'lns_service_not_available', 'cannot create a lns application');
  }
  reqApp.app_eui = lnsApp.app_eui;
  const oldApplication = await applicationService.getApplicationByAppId(reqApp.app_id);
  if (oldApplication) {
    throwApplicationExist(reqApp.app_id);
  } else {
    await applicationService.addApplication(reqApp);
    const application = await applicationService.getApplicationByAppId(reqApp.app_id);
    res.status(httpStatus.CREATED).json(application);
  }
});

const getApplications = catchAsync(async (req, res) => {
  const apps = await applicationService.getApplications();

  res.send(apps);
});

//! BY app_id
const deleteApplicationByAppId = catchAsync(async (req, res) => {
  const oldApplication = await applicationService.getApplicationByAppId(req.params.app_id);
  if (!oldApplication) {
    throwApplicationNotFound(req.params.app_id);
  }
  try {
    await lnsService.deleteApp(oldApplication.app_eui);
  } catch (e) {
    if (e.response.status !== httpStatus.NOT_FOUND) {
      throw e;
    }
  }
  await applicationService.deleteApplicationByAppId(req.params.app_id);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateApplicationByAppId = catchAsync(async (req, res) => {
  const oldApplication = await applicationService.getApplicationByAppId(req.params.app_id);
  if (!oldApplication) {
    throwApplicationNotFound(req.params.app_id);
  }
  await applicationService.updateApplicationByAppId(req.params.app_id, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

const getApplicationByAppId = catchAsync(async (req, res) => {
  const app = await applicationService.getApplicationByAppId(req.params.app_id);
  if (!app) {
    throwApplicationNotFound(req.params.app_id);
  }

  res.send(app);
});

module.exports = {
  addApplication,
  getApplications,
  getApplicationByAppId,
  deleteApplicationByAppId,
  updateApplicationByAppId,
  throwApplicationNotFound,
  throwApplicationExist,
};
