const Processor = require("./processor");

/**
 * Build the site.
 * @param  {Object} options - The site configuration options.
 * @return {Processor}
 */
const build = async (options = {}) => {
  const processor = new Processor(options);

  await processor.process();

  console.log(`✅ Build complete: ${processor.config.output}`);

  return processor;
};

module.exports = build;
