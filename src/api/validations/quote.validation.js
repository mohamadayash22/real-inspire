import Joi from 'joi';

import { sortBy } from './custom.validation.js';

const getQuotesSchema = {
  query: Joi.object({
    author: Joi.string(),
    minLength: Joi.number().integer().min(1).default(1),
    maxLength: Joi.number().integer().min(1).default(500),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(20).default(20),
    sortBy: sortBy('author', 'content', 'length'),
  }),
};

const getRandomQuotesSchema = {
  query: Joi.object({
    author: Joi.string(),
    minLength: Joi.number().integer().min(1).default(1),
    maxLength: Joi.number().integer().min(1).default(500),
    limit: Joi.number().integer().min(1).max(20).default(1),
  }),
};

export default {
  getQuotesSchema,
  getRandomQuotesSchema,
};
