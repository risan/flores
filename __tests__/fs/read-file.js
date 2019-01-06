/* global expect:false, test:false */
const path = require("path");

const readFile = require("../../src/fs/read-file");

const TEST_FILE = path.resolve(__dirname, "../fixtures/src/robot.txt");

test("it can read file", async () => {
  const source = await readFile(TEST_FILE);

  expect(source).toBe("User-agent: *\n");
});
