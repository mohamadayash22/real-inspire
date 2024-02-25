import { Router } from 'express';

import validate from '../middlewares/validate.middleware.js';
import quoteController from '../controllers/quote.controller.js';
import authorController from '../controllers/author.controller.js';
import quoteValidation from '../validations/quote.validation.js';
import authorValidation from '../validations/author.validation.js';

const router = Router();

router.get('/quotes', validate(quoteValidation.getQuotesSchema), quoteController.getQuotes);
router.get('/quotes/random', validate(quoteValidation.getRandomQuotesSchema), quoteController.getRandomQuotes);

router.get('/authors', validate(authorValidation.getAuthorsSchema), authorController.getAuthors);
router.get('/authors/:slug', validate(authorValidation.getAuthorBySlugSchema), authorController.getAuthorBySlug);

export default router;
