import { Schema, model } from 'mongoose';

import paginate from './plugins/paginate.plugin.js';
import toJSON from './plugins/toJSON.plugin.js';

const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    quoteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

authorSchema.index({ quoteCount: -1 }, { name: 'quoteCountIndex' });

authorSchema.plugin(paginate);
authorSchema.plugin(toJSON);

const Author = model('Author', authorSchema);

export default Author;
