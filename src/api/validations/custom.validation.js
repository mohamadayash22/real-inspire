import Joi from 'joi';

export const sortBy = (...validProperties) => {
  return Joi.string()
    .custom((value, helpers) => {
      const validOrders = ['asc', 'desc'];
      const options = value.split(',');

      let errorType;
      const isInvalid = options.some((option) => {
        const [property, order] = option.split(':');
        if (!validProperties.includes(property)) {
          errorType = 'custom.property';
          return true;
        }

        if (!validOrders.includes(order)) {
          errorType = 'custom.order';
          return true;
        }

        return false;
      });

      if (isInvalid) {
        return helpers.error(errorType);
      }

      return value;
    }, 'Sort By Validator')
    .messages({
      'custom.property': `"sortBy" property must be one of [${validProperties.join(', ')}]`,
      'custom.order': 'Order must be either "asc" or "desc"',
    });
};

export default sortBy;
