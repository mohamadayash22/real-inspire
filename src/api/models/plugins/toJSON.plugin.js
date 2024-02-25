/* eslint-disable no-param-reassign */

const toJSON = (schema) => {
  schema.options.toJSON = {
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    },
  };
};

export default toJSON;
