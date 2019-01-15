const http = require("http");

const express = require("express");

/**
 * Create server.
 * @param  {String} options.root - The root directory.
 * @return {http.Server}
 */
const createServer = ({ root }) => {
  const app = express();

  app.use(express.static(root));

  return http.createServer(app);
};

module.exports = createServer;
