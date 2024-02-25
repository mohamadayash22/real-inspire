import Joi from 'joi';

import { sortBy } from './custom.validation.js';

const getAuthorsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(20).default(20),
    sortBy: sortBy('name', 'quoteCount'),
  }),
};

const getAuthorBySlugSchema = {
  param: Joi.object({
    slug: Joi.string().required(),
  }),
};

export default {
  getAuthorsSchema,
  getAuthorBySlugSchema,
};
