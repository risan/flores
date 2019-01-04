/* global expect:false, test:false */
const flores = require("../src");

test("it has build, serve, and watch function", () => {
  expect(typeof flores.build).toBe("function");
  expect(typeof flores.serve).toBe("function");
  expect(typeof flores.watch).toBe("function");
});
