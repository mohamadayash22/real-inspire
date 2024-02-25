import { Schema, model } from 'mongoose';

import paginate from './plugins/paginate.plugin.js';
import toJSON from './plugins/toJSON.plugin.js';

const quoteSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    authorSlug: {
      type: String,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

quoteSchema.statics.findRandom = async function (filter, limit) {
  const randomQuotes = await this.aggregate([{ $match: filter }, { $sample: { size: limit } }]);
  return randomQuotes.map((quote) => new this(quote).toJSON());
};

quoteSchema.index({ authorSlug: 1 }, { name: 'authorSlugIndex' });
quoteSchema.index({ length: 1 }, { name: 'lengthIndex' });

quoteSchema.plugin(paginate);
quoteSchema.plugin(toJSON);

const Quote = model('Quote', quoteSchema);

export default Quote;
