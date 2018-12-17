const build = require("./build");
const runServer = require("./run-server");

/**
 * Serve the generated site.
 * @param  {Object} options - The configuration data.
 * @return {Promise}
 */
const serve = async (options = {}) => {
  const { config } = await build({ ...options, env: "development" });

  await runServer({
    publicDir: config.outputDir,
    port: config.port
  });

  console.log(`⚡️ Server is running: http://localhost:${config.port}`);
};

module.exports = serve;
