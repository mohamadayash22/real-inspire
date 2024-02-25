/* eslint-disable no-param-reassign */

const createSortingOptions = (sortBy) => {
  if (!sortBy) return '-createdAt';

  const sortingOptions = sortBy.split(',').map((option) => {
    const [property, order] = option.split(':');
    return (order === 'asc' ? '' : '-') + property;
  });

  return sortingOptions.join(' ');
};

const paginate = (schema) => {
  schema.statics.paginate = async function (filter, options) {
    const { page, limit, sortBy } = options;
    const skip = (page - 1) * limit;
    const sort = createSortingOptions(sortBy);

    const [results, totalItems] = await Promise.all([
      this.find(filter).sort(sort).skip(skip).limit(limit),
      this.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, currentPage: page, pageSize: limit, totalPages, results };
  };
};

export default paginate;
