import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import httpStatus from 'http-status';

import routes from './api/routes/routes.js';
import morgan from './config/morgan.js';
import config from './config/config.js';
import { notFoundHandler, errorConverter, errorHandler } from './api/middlewares/error.middleware.js';
import ApiError from './api/utils/apiError.js';

const app = express();

app.set('trust proxy', 1);

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(helmet());

app.use(cors());

app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    handler: (req, res, next) => {
      next(new ApiError(httpStatus.TOO_MANY_REQUESTS, httpStatus[httpStatus.TOO_MANY_REQUESTS]));
    },
  }),
);

app.use('/v1', routes);

app.get('/v1', (req, res) => {
  res.redirect('https://github.com/mohamadayash22/real-inspire');
});

app.use(notFoundHandler);
app.use(errorConverter);
app.use(errorHandler);

export default app;
