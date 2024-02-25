import createSlug from './createSlug.js';

const createQuotesFilter = ({ author, minLength, maxLength }) => {
  const authorSlug = author ? createSlug(author) : null;
  const quotesFilter = {
    length: { $gte: minLength, $lte: maxLength },
    ...(author && { authorSlug }),
  };

  return quotesFilter;
};

export default createQuotesFilter;
