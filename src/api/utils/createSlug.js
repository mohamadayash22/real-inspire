import slugify from 'slugify';

const createSlug = (title) => {
  return slugify(title, { lower: true, strict: true });
};

export default createSlug;
