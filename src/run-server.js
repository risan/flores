/* eslint no-console: "off" */
const express = require("express");
const SocketIo = require("socket.io");

/**
 * Run the server.
 * @param  {String}  options.publicDir - The directory to serve.
 * @param  {Number}  options.port      - The port to listen to.
 * @param  {Boolean} options.watch     - Set to true to run watcher.
 * @return {Promise}
 */
const runServer = ({ publicDir, port, watch = false }) => {
  const app = express();

  app.use(express.static(publicDir));

  return new Promise(resolve => {
    const server = app.listen(port, () => {
      console.log(`⚡️ Server is running: http://localhost:${port}`);

      if (watch) {
        app.get("/flores/socket-client.js", (req, res) =>
          res.sendFile(`${__dirname}/socket-client.js`)
        );

        const socketIo = new SocketIo(server);

        resolve({ app, server, socketIo });
      } else {
        resolve({ app, server });
      }
    });
  });
};

module.exports = runServer;
