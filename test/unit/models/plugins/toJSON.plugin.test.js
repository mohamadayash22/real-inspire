import mongoose from 'mongoose';

import toJSON from '../../../../src/api/models/plugins/toJSON.plugin';

describe('toJSON plugin', () => {
  let connection;
  beforeEach(async () => {
    connection = mongoose.createConnection();
  });

  it('should remove _id and __v', () => {
    const schema = new mongoose.Schema();
    const Model = connection.model('Model', schema);
    schema.plugin(toJSON);
    const doc = new Model();

    expect(doc.toJSON()).not.toHaveProperty('_id');
    expect(doc.toJSON()).not.toHaveProperty('__v');
  });

  it('should remove createdAt and updatedAt', () => {
    const schema = new mongoose.Schema({}, { timestamps: true });
    const Model = connection.model('Model', schema);
    schema.plugin(toJSON);
    const doc = new Model();

    expect(doc.toJSON()).not.toHaveProperty('createdAt');
    expect(doc.toJSON()).not.toHaveProperty('updatedAt');
  });
});
