import httpStatus from 'http-status';

import Author from '../models/author.model.js';
import ApiError from '../utils/apiError.js';
import createSlug from '../utils/createSlug.js';

const getAuthors = async (filter, options) => {
  return Author.paginate(filter, options);
};

const getAuthorBySlug = async (name) => {
  const authorSlug = createSlug(name);
  const author = await Author.findOne({ slug: authorSlug });
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');
  }
  return author;
};

export default {
  getAuthors,
  getAuthorBySlug,
};
