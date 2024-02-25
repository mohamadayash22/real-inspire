import nodeMocks from 'node-mocks-http';
import httpStatus from 'http-status';

import ApiError from '../../../src/api/utils/apiError.js';
import config from '../../../src/config/config.js';
import { errorConverter, errorHandler, notFoundHandler } from '../../../src/api/middlewares/error.middleware.js';

describe('Error Middlewares', () => {
  describe('Not found handler', () => {
    it('should call next with an ApiError with status 404', () => {
      const error = new ApiError(httpStatus.NOT_FOUND, httpStatus[httpStatus.NOT_FOUND]);
      const next = jest.fn();

      notFoundHandler(nodeMocks.createRequest(), nodeMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('Error converter', () => {
    it('should return the same api error object it was called with', () => {
      const error = new ApiError(httpStatus.BAD_REQUEST, 'Any error');
      const next = jest.fn();

      errorConverter(error, nodeMocks.createRequest(), nodeMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should convert an Error to ApiError and preserve its status and message', () => {
      const error = new Error('Any error');
      error.statusCode = httpStatus.BAD_REQUEST;
      const next = jest.fn();

      errorConverter(error, nodeMocks.createRequest(), nodeMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(new ApiError(error.statusCode, error.message, false, error.stack));
    });

    it('should convert an Error without status to an ApiError with status 500', () => {
      const next = jest.fn();
      const error = new Error('Any error');

      errorConverter(error, nodeMocks.createRequest(), nodeMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message, false, error.stack));
    });

    it('should convert an Error without message to ApiError with default message of that http status', () => {
      const next = jest.fn();
      const error = new Error();
      error.statusCode = httpStatus.BAD_REQUEST;

      errorConverter(error, nodeMocks.createRequest(), nodeMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(new ApiError(error.statusCode, httpStatus[error.statusCode], false, error.stack));
    });

    it('should convert any other object to ApiError with status 500 and its message', () => {
      const next = jest.fn();
      const error = {};

      errorConverter(error, nodeMocks.createRequest(), nodeMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, httpStatus[httpStatus.INTERNAL_SERVER_ERROR], false, error.stack),
      );
    });
  });

  describe('Error handler', () => {
    it('should put errorMessage in res.locals and send error response in development environment', () => {
      config.env = 'development';
      const error = new ApiError(httpStatus.BAD_REQUEST, 'Any error');
      const res = nodeMocks.createResponse();
      const next = jest.fn();

      errorHandler(error, nodeMocks.createRequest(), res, next);

      expect(res.locals.errorMessage).toBe(error.message);
      expect(res.statusCode).toBe(error.statusCode);
      expect(res._getData()).toEqual({
        statusCode: error.statusCode,
        message: error.message,
        stack: error.stack,
      });
    });

    it('should send 500 status and its message for non-operational errors in production environment', () => {
      config.env = 'production';
      const res = nodeMocks.createResponse();
      const next = jest.fn();
      const error = new ApiError(httpStatus.BAD_REQUEST, 'Any error', false);

      errorHandler(error, nodeMocks.createRequest(), res, next);

      expect(res.locals.errorMessage).toBe(httpStatus[httpStatus.INTERNAL_SERVER_ERROR]);
      expect(res.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res._getData()).toEqual({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
      });
    });

    it('should preserve error status and message for operational erros in production environment', () => {
      config.env = 'production';
      const res = nodeMocks.createResponse();
      const next = jest.fn();
      const error = new ApiError(httpStatus.BAD_REQUEST, 'Any error', true);

      errorHandler(error, nodeMocks.createRequest(), res, next);

      expect(res.locals.errorMessage).toBe(error.message);
      expect(res.statusCode).toBe(error.statusCode);
      expect(res._getData()).toEqual({
        statusCode: error.statusCode,
        message: error.message,
      });
    });
  });
});
