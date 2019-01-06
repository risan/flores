/* global expect:false, test:false */
const md5 = require("../../src/util/md5");

test("it can generate md5 hash", () => {
  const hash = md5("foo");

  expect(hash).toBe("acbd18db4cc2f85cedef654fccc4a4d8");
});
