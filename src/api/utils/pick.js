const pick = (object, keys) => {
  const res = {};
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      res[key] = object[key];
    }
  });
  return res;
};

export default pick;
