/**
 * A wrapper function to catch not handled exceptions
 * @param {*} fn
 * @returns fn
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;
