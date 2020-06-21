const encode = (data) => {
  if (data) {
    data = encodeURI(data);
    data = data.replace("%5B", "[");
    data = data.replace("%5D", "]");
    return data;
  }
  return data;
};

module.exports = encode;
