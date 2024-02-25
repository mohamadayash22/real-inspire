import authorService from '../services/author.service.js';
import catchAsync from '../utils/catchAsync.js';
import pick from '../utils/pick.js';

const getAuthors = catchAsync(async (req, res) => {
  const options = pick(req.query, ['page', 'limit', 'sortBy']);
  const authors = await authorService.getAuthors({}, options);
  res.json(authors);
});

const getAuthorBySlug = catchAsync(async (req, res) => {
  const author = await authorService.getAuthorBySlug(req.params.slug);
  res.json(author);
});

export default {
  getAuthors,
  getAuthorBySlug,
};
