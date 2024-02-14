const httpStatus = require('http-status');
const { AxiosError } = require('axios');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const errorConverter = (err, req, res, next) => {
  if (err.response) {
    logger.error(JSON.stringify(err.response.data));
  }
  if (err instanceof AxiosError) {
    let error;
    if (err.config?.url?.includes(config.lnsHost)) {
      error = 'lns_service_not_available';
    } else if (err.config?.url?.includes(config.edgeXHost)) {
      error = 'edgex_service_not_available';
    } else {
      error = 'internal_server_error';
    }
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error, `${err.code}: ${err.response.data.message}`, err.stack));
  } else if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || httpStatus[statusCode];
    next(new ApiError(statusCode, message, message, err.stack));
  } else {
    next(err);
  }
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { statusCode, error, errorDescription } = err;

  res.locals.errorMessage = err.message;

  const response = {
    error,
    error_description: errorDescription,
  };

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
