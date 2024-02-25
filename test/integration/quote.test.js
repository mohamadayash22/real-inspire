import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import Quote from '../../src/api/models/quote.model.js';
import setupTestDB from '../utils/setupTestDB.js';
import { seedQuotes } from '../utils/seedData.js';

setupTestDB();

describe('Quote routes', () => {
  let quotes;
  beforeAll(async () => {
    quotes = seedQuotes(20);
    await Quote.insertMany(quotes);
  });

  describe('GET /quotes', () => {
    it('should return 200 status and apply default query options', async () => {
      const res = await request(app).get('/v1/quotes').expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: 20,
        currentPage: 1,
        pageSize: 20,
        totalPages: 1,
      });
      expect(res.body.results).toHaveLength(20);
      expect(res.body.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            author: expect.any(String),
            authorSlug: expect.any(String),
            content: expect.any(String),
            length: expect.any(Number),
          }),
        ]),
      );
    });

    it('should return the correct page if page and limit params are specified', async () => {
      const res = await request(app).get('/v1/quotes').query({ page: 2, limit: 5 }).expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: 20,
        currentPage: 2,
        pageSize: 5,
        totalPages: 4,
      });
      expect(res.body.results).toHaveLength(5);
    });

    it('should limit returned results if limit param is specified', async () => {
      const res = await request(app).get('/v1/quotes').query({ limit: 15 }).expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: 20,
        currentPage: 1,
        pageSize: 15,
        totalPages: 2,
      });
      expect(res.body.results).toHaveLength(15);
    });

    it('should correctly sort the results if ascending sort param is specified', async () => {
      const res = await request(app).get('/v1/quotes').query({ sortBy: 'length:asc' }).expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: 20,
        currentPage: 1,
        pageSize: 20,
        totalPages: 1,
      });
      expect(res.body.results).toHaveLength(20);

      const sortedQuotes = [...res.body.results].sort((a, b) => a.length - b.length);
      expect(res.body.results).toEqual(sortedQuotes);
    });

    it('should correctly sort the results if descending sort param is specified', async () => {
      const res = await request(app).get('/v1/quotes').query({ sortBy: 'length:desc' }).expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: 20,
        currentPage: 1,
        pageSize: 20,
        totalPages: 1,
      });
      expect(res.body.results).toHaveLength(20);

      const sortedQuotes = [...res.body.results].sort((a, b) => b.length - a.length);
      expect(res.body.results).toEqual(sortedQuotes);
    });

    it('should correctly apply minLength filter if minLength param is specified', async () => {
      const filteredQuotes = quotes.filter((quote) => quote.length >= 100);
      const totalPages = Math.ceil(filteredQuotes.length / 20);

      const res = await request(app).get('/v1/quotes').query({ minLength: 100 }).expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: filteredQuotes.length,
        currentPage: 1,
        pageSize: 20,
        totalPages,
      });

      res.body.results.forEach((quote) => {
        expect(quote.length).toBeGreaterThanOrEqual(100);
      });
    });

    it('should correctly apply maxLength filter if maxLength param is specified', async () => {
      const filteredQuotes = quotes.filter((quote) => quote.length <= 150);
      const totalPages = Math.ceil(filteredQuotes.length / 20);

      const res = await request(app).get('/v1/quotes').query({ maxLength: 150 }).expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: filteredQuotes.length,
        currentPage: 1,
        pageSize: 20,
        totalPages,
      });

      res.body.results.forEach((quote) => {
        expect(quote.length).toBeLessThanOrEqual(150);
      });
    });

    it('should correctly apply author filter if author name is specified', async () => {
      const filteredQuotes = quotes.filter((quote) => quote.author === quotes[0].author);
      const totalPages = Math.ceil(filteredQuotes.length / 20);

      const res = await request(app).get('/v1/quotes').query({ author: quotes[0].author }).expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: filteredQuotes.length,
        currentPage: 1,
        pageSize: 20,
        totalPages,
      });

      res.body.results.forEach((quote) => {
        expect(quote.author).toBe(quotes[0].author);
      });
    });

    it('should correctly apply author filter if author slug is specified', async () => {
      const res = await request(app).get('/v1/quotes').query({ author: quotes[0].authorSlug }).expect(httpStatus.OK);

      const filteredQuotes = quotes.filter((quote) => quote.authorSlug === quotes[0].authorSlug);
      const totalPages = Math.ceil(filteredQuotes.length / 20);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: filteredQuotes.length,
        currentPage: 1,
        pageSize: 20,
        totalPages,
      });

      res.body.results.forEach((quote) => {
        expect(quote.authorSlug).toBe(quotes[0].authorSlug);
      });
    });

    it('should return a 400 error if limit is greater than 20', async () => {
      const res = await request(app).get('/v1/authors').query({ limit: 50 }).expect(httpStatus.BAD_REQUEST);

      expect(res.body).toEqual({
        statusCode: httpStatus.BAD_REQUEST,
        message: expect.any(String),
      });
    });

    it('should return a 400 error for invalid sort field', async () => {
      const res = await request(app).get('/v1/authors').query({ sortBy: 'invalid:desc' }).expect(httpStatus.BAD_REQUEST);

      expect(res.body).toEqual({
        statusCode: httpStatus.BAD_REQUEST,
        message: expect.any(String),
      });
    });

    it('should return a 400 error for invalid sort order', async () => {
      const res = await request(app).get('/v1/authors').query({ sortBy: 'name:invalid' }).expect(httpStatus.BAD_REQUEST);

      expect(res.body).toEqual({
        statusCode: httpStatus.BAD_REQUEST,
        message: expect.any(String),
      });
    });
  });

  describe('GET /quotes/random', () => {
    it('should return one random quote if limit is not specified', async () => {
      const res = await request(app).get('/v1/quotes/random').expect(httpStatus.OK);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(1);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            content: expect.any(String),
            author: expect.any(String),
            authorSlug: expect.any(String),
            length: expect.any(Number),
          }),
        ]),
      );
    });

    it('should return multiple random quotes if limit is specified', async () => {
      const res = await request(app).get('/v1/quotes/random').query({ limit: 10 }).expect(httpStatus.OK);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(10);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            content: expect.any(String),
            author: expect.any(String),
            authorSlug: expect.any(String),
            length: expect.any(Number),
          }),
        ]),
      );

      const uniqueQuotes = new Set(res.body);
      expect(uniqueQuotes.size).toBe(10);
    });

    it('should correctly apply minLength filter if minLength param is specified', async () => {
      const res = await request(app).get('/v1/quotes/random').query({ minLength: 100 }).expect(httpStatus.OK);

      res.body.forEach((quote) => {
        expect(quote.length).toBeGreaterThanOrEqual(100);
      });
    });

    it('should correctly apply maxLength filter if maxLength param is specified', async () => {
      const res = await request(app).get('/v1/quotes/random').query({ maxLength: 150 }).expect(httpStatus.OK);

      res.body.forEach((quote) => {
        expect(quote.length).toBeLessThanOrEqual(150);
      });
    });

    it('should correctly apply author filter if author name is specified', async () => {
      const { author } = quotes[0];
      const res = await request(app).get('/v1/quotes/random').query({ author }).expect(httpStatus.OK);

      res.body.forEach((quote) => {
        expect(quote.author).toBe(author);
      });
    });

    it('should correctly apply author filter if author slug is specified', async () => {
      const { authorSlug } = quotes[0];
      const res = await request(app).get('/v1/quotes/random').query({ author: authorSlug }).expect(httpStatus.OK);

      res.body.forEach((quote) => {
        expect(quote.authorSlug).toBe(authorSlug);
      });
    });
  });
});
