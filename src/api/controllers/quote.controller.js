import quoteService from '../services/quote.service.js';
import catchAsync from '../utils/catchAsync.js';
import pick from '../utils/pick.js';

const getQuotes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['author', 'minLength', 'maxLength']);
  const options = pick(req.query, ['page', 'limit', 'sortBy']);
  const quotes = await quoteService.getQuotes(filter, options);
  res.json(quotes);
});

const getRandomQuotes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['author', 'minLength', 'maxLength']);
  const options = pick(req.query, ['limit']);
  const randomQuotes = await quoteService.getRandomQuotes(filter, options);
  res.json(randomQuotes);
});

export default {
  getQuotes,
  getRandomQuotes,
};
