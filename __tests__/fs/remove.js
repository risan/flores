/* global afterAll:false, beforeEach:false, expect:false, test:false */
const path = require("path");

const fs = require("fs-extra");

const remove = require("../../src/fs/remove");

const TEST_DIR = path.resolve(__dirname, "../fixtures/remove-test");

const TEST_FILE = path.resolve(TEST_DIR, "test.txt");

beforeEach(() => fs.outputFile(TEST_FILE, "foo"));

afterAll(() => fs.remove(TEST_DIR));

test("it can remove file", async () => {
  let fileExists = await fs.pathExists(TEST_FILE);
  expect(fileExists).toBe(true);

  await remove(TEST_FILE);

  fileExists = await fs.pathExists(TEST_FILE);
  expect(fileExists).toBe(false);
});

test("it can remove directory", async () => {
  let dirExists = await fs.pathExists(TEST_DIR);
  expect(dirExists).toBe(true);

  await remove(TEST_DIR);

  dirExists = await fs.pathExists(TEST_DIR);
  expect(dirExists).toBe(false);
});
