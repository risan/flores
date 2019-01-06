/* global afterAll:false, beforeEach:false, expect:false, test:false */
const path = require("path");

const fs = require("fs-extra");

const writeFile = require("../../src/fs/write-file");

const TEST_DIR = path.resolve(__dirname, "../fixtures/write-file-test");
const TEST_FILE = path.resolve(TEST_DIR, "foo/bar/baz.txt");

beforeEach(() => fs.remove(TEST_DIR));

afterAll(() => fs.remove(TEST_DIR));

test("it can write to file", async () => {
  let exists = await fs.pathExists(TEST_FILE);
  expect(exists).toBe(false);

  await writeFile(TEST_FILE, "foo bar");

  exists = await fs.pathExists(TEST_FILE);
  expect(exists).toBe(true);

  const source = await fs.readFile(TEST_FILE, "utf8");
  expect(source).toBe("foo bar");
});
