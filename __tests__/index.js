/* global expect:false, test:false */
const flores = require("../src");

test("it has build function", () => {
  expect(typeof flores.build).toBe("function");
});

test("it has serve function", () => {
  expect(typeof flores.serve).toBe("function");
});
