const writeFile = require("./write-file");

const generateOutputPath = require("../util/generate-output-path");
const md5 = require("../util/md5");

/**
 * Write data to file.
 * @param  {String} path - The file path.
 * @param  {String} data - The data to write.
 * @return {String}
 */
const writeToOutput = async (
  data,
  { source, hash = undefined, ...options }
) => {
  const hashOption = hash === true ? md5(data).substring(0, 10) : hash;

  const path = generateOutputPath(source, {
    hash: hashOption,
    ...options
  });

  await writeFile(path, data);

  return path;
};

module.exports = writeToOutput;
