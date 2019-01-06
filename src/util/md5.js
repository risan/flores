const crypto = require("crypto");

/**
 * Generate md5 hash.
 * @param  {String} data - Data to hash.
 * @return {String}
 */
const md5 = data => {
  const hash = crypto.createHash("md5");

  hash.update(data);

  return hash.digest("hex");
};

module.exports = md5;
