import Quote from '../models/quote.model.js';
import createQuotesFilter from '../utils/filter.js';

const getQuotes = async (filter, options) => {
  const quotesFilter = createQuotesFilter(filter);
  return Quote.paginate(quotesFilter, options);
};

const getRandomQuotes = async (filter, { limit }) => {
  const quotesFilter = createQuotesFilter(filter);
  return Quote.findRandom(quotesFilter, limit);
};

export default {
  getQuotes,
  getRandomQuotes,
};
