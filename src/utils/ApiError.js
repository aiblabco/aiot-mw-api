class ApiError extends Error {
  constructor(statusCode, error, errorDescription, isOperational = true, stack = '') {
    super(statusCode);
    this.error = error;
    this.statusCode = statusCode;
    this.errorDescription = errorDescription;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
