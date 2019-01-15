/* eslint no-console: "off" */
const createServer = require("./create-server");
const Processor = require("./processor");

/**
 * Serve the website.
 * @param  {Object} options - The site configuration options.
 * @return {Processor}
 */
const serve = async (options = {}) => {
  const processor = new Processor({ ...options, env: "development" });

  await processor.process();

  const server = createServer({ root: processor.config.output });

  server.listen(processor.config.url.port, () =>
    console.log(`⚡️ Server is running: ${processor.config.url}`)
  );

  return processor;
};

module.exports = serve;
