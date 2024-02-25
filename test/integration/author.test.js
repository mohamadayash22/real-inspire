import request from 'supertest';
import httpStatus from 'http-status';

import app from '../../src/app';
import Author from '../../src/api/models/author.model';
import setupTestDB from '../utils/setupTestDB';
import { seedAuthors } from '../utils/seedData';

setupTestDB();

describe('Author routes', () => {
  let authors;
  beforeAll(async () => {
    authors = seedAuthors(20);
    await Author.insertMany(authors);
  });

  describe('GET /authors', () => {
    it('should return 200 status and apply the default query options', async () => {
      const res = await request(app).get('/v1/authors').expect(httpStatus.OK);

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
            name: expect.any(String),
            slug: expect.any(String),
            description: expect.any(String),
            bio: expect.any(String),
            link: expect.any(String),
            quoteCount: expect.any(Number),
          }),
        ]),
      );
    });

    it('should return the correct page if page and limit params are specified', async () => {
      const res = await request(app).get('/v1/authors').query({ page: 2, limit: 10 }).expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: 20,
        currentPage: 2,
        pageSize: 10,
        totalPages: 2,
      });
      expect(res.body.results).toHaveLength(10);
    });

    it('should limit returned results if limit param is specified', async () => {
      const res = await request(app).get('/v1/authors').query({ limit: 5 }).expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: 20,
        currentPage: 1,
        pageSize: 5,
        totalPages: 4,
      });
      expect(res.body.results).toHaveLength(5);
    });

    it('should correctly sort the results if ascending sort param is specified', async () => {
      const res = await request(app).get('/v1/authors').query({ sortBy: 'name:asc' }).expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: 20,
        currentPage: 1,
        pageSize: 20,
        totalPages: 1,
      });
      expect(res.body.results).toHaveLength(20);

      const sortedAuthors = [...res.body.results].sort((a, b) => a.name.localeCompare(b.name));
      expect(res.body.results).toEqual(sortedAuthors);
    });

    it('should correctly sort the results if descending sort param is specified', async () => {
      const res = await request(app).get('/v1/authors').query({ sortBy: 'quoteCount:desc' }).expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: 20,
        currentPage: 1,
        pageSize: 20,
        totalPages: 1,
      });
      expect(res.body.results).toHaveLength(20);

      const sortedAuthors = [...res.body.results].sort((a, b) => b.quoteCount - a.quoteCount);
      expect(res.body.results).toEqual(sortedAuthors);
    });

    it('should correctly sort the results if multiple sorting params are specified', async () => {
      const res = await request(app).get('/v1/authors').query({ sortBy: 'quoteCount:desc,name:asc' }).expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        totalItems: 20,
        currentPage: 1,
        pageSize: 20,
        totalPages: 1,
      });
      expect(res.body.results).toHaveLength(20);

      const sortedAuthors = [...res.body.results].sort((a, b) => {
        if (b.quoteCount === a.quoteCount) {
          return a.name.localeCompare(b.name);
        }
        return b.quoteCount - a.quoteCount;
      });
      expect(res.body.results).toEqual(sortedAuthors);
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

  describe('GET /authors/:slug', () => {
    it('should return 200 status and the author if slug is specified', async () => {
      const author = authors[0];
      const res = await request(app).get(`/v1/authors/${author.slug}`).expect(httpStatus.OK);

      expect(res.body).toEqual(author);
    });

    it('should return 200 status and the author if name is specified', async () => {
      const author = authors[0];
      const res = await request(app).get(`/v1/authors/${author.name}`).expect(httpStatus.OK);

      expect(res.body).toEqual(author);
    });

    it('should return 404 error if author does not exist', async () => {
      const res = await request(app).get('/v1/authors/not-exists').expect(httpStatus.NOT_FOUND);

      expect(res.body).toEqual({
        statusCode: httpStatus.NOT_FOUND,
        message: expect.any(String),
      });
    });
  });
});
