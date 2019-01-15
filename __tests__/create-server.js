/* global expect:false, test:false */
const { Server } = require("http");

const createServer = require("../src/create-server");

test("it can create http server", () => {
  const server = createServer({ root: "/foo/bar" });

  expect(server).toBeInstanceOf(Server);
});
