import { faker } from '@faker-js/faker';

import createSlug from '../../src/api/utils/createSlug.js';

const generateAuthor = () => {
  const name = faker.person.fullName();
  const slug = createSlug(name);
  const description = faker.lorem.sentence();
  const bio = faker.lorem.paragraph();
  const link = faker.internet.url();
  const quoteCount = faker.number.int({ min: 0, max: 100 });

  return { name, slug, description, bio, link, quoteCount };
};

const generateQuote = () => {
  const author = faker.person.fullName();
  const authorSlug = createSlug(author);
  const content = faker.lorem.sentence({ min: 5, max: 20 });
  const { length } = content;

  return { author, authorSlug, content, length };
};

const seedAuthors = (length) => {
  return Array.from({ length }, generateAuthor);
};

const seedQuotes = (length) => {
  return Array.from({ length }, generateQuote);
};

export { seedAuthors, seedQuotes };
