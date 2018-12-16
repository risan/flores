const express = require("express");

/**
 * Run the server.
 * @param  {String} options.publicDir - The directory to serve.
 * @param  {Number} options.port      - The port to listen to.
 * @return {Promise}
 */
const runServer = ({ publicDir, port }) => {
  const app = express();

  app.use(express.static(publicDir));

  return new Promise(resolve =>
    app.listen(port, () => resolve(app, { publicDir, port }))
  );
};

module.exports = runServer;
