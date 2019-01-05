/* global afterAll:false, beforeEach:false, expect:false, test:false */
const path = require("path");

const fs = require("fs-extra");

const copy = require("../../src/fs/copy");

const SOURCE_PATH = path.resolve(__dirname, "../fixtures/src/robot.txt");
const DESTINATION_PATH = path.resolve(
  __dirname,
  "../fixtures/copy-file-test/robot.txt"
);

beforeEach(() => fs.remove(DESTINATION_PATH));

afterAll(() => fs.remove(path.dirname(DESTINATION_PATH)));

test("it can copy file", async () => {
  let destExists = await fs.pathExists(DESTINATION_PATH);
  expect(destExists).toBe(false);

  await copy(SOURCE_PATH, DESTINATION_PATH);

  destExists = await fs.pathExists(DESTINATION_PATH);
  expect(destExists).toBe(true);

  const source = await fs.readFile(SOURCE_PATH, "utf8");
  const destination = await fs.readFile(DESTINATION_PATH, "utf8");

  expect(destination).toBe(source);
});
