import httpStatus from 'http-status';

import config from '../../config/config.js';
import logger from '../../config/logger.js';
import ApiError from '../utils/apiError.js';

const notFoundHandler = (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, httpStatus[httpStatus.NOT_FOUND]));
};

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = message;

  const response = {
    statusCode,
    message,
  };

  if (config.env === 'development') {
    Object.assign(response, { stack: err.stack });
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export { notFoundHandler, errorConverter, errorHandler };
