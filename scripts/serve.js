const build = require("./build");
const runServer = require("./run-server");

/**
 * Serve the generated site.
 * @param  {String} basePath - The project base path.
 * @return {Promise}
 */
const serve = async (basePath = process.cwd()) => {
  const { config } = await build(basePath);

  await runServer({
    publicDir: config.outputDir,
    port: config.port
  });

  console.log(`⚡️ Server is running: http://localhost:${config.port}`);
};

module.exports = serve;
