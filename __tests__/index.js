/* global expect:false, test:false */
const flores = require("../src");

test("it has build function", () => {
  expect(typeof flores.build).toBe("function");
});
