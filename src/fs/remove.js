const fs = require("fs-extra");

/**
 * Remove path or directory.
 * @param  {String} path - File path or directory to remove.
 * @return {Promise}
 */
const remove = path => fs.remove(path);

module.exports = remove;
