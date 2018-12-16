const path = require("path");

const fs = require("fs-extra");
const globby = require("globby");

/**
 * Copy static files.
 * @param  {Config} config - The Config instance.
 * @return {Array}
 */
const copyStaticFiles = async config => {
  const files = await globby(config.copyFiles, {
    cwd: config.sourceDir
  });

  await Promise.all(files.map(file => fs.copy(
    path.join(config.sourceDir, file),
    path.join(config.outputDir, file)
  )));

  return files;
};

module.exports = copyStaticFiles;
