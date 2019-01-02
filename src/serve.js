const build = require("./build");
const runServer = require("./run-server");

/**
 * Serve the generated site.
 * @param  {Object} options - The configuration data.
 * @return {Promise}
 */
const serve = async (options = {}) => {
  const { config } = await build({ ...options, env: "development" });

  runServer({
    publicDir: config.outputPath,
    port: config.port
  });
};

module.exports = serve;
