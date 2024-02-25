import httpStatus from 'http-status';
import Joi from 'joi';

import pick from '../utils/pick.js';
import ApiError from '../utils/apiError.js';

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['body', 'param', 'query']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false, allowUnknown: true, stripUnknown: true })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }

  Object.assign(req, value);
  next();
};

export default validate;
