import mongoose from 'mongoose';

import config from '../../src/config/config';

const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongodbUri);
  });

  afterAll(async () => {
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany()));
    await mongoose.connection.close();
  });
};

export default setupTestDB;
