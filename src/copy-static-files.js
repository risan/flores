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
    cwd: config.sourcePath
  });

  await Promise.all(
    files.map(file =>
      fs.copy(
        path.join(config.sourcePath, file),
        path.join(config.outputPath, file)
      )
    )
  );

  return files;
};

module.exports = copyStaticFiles;
