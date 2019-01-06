/* global expect:false, jest:false, test:false */
const path = require("path");

const copy = require("../../src/fs/copy");
const globCopy = require("../../src/fs/glob-copy");

jest.mock("../../src/fs/copy");

const SOURCE_DIR = path.resolve(__dirname, "../fixtures/src");
const DESTINATION_DIR = path.resolve(__dirname, "../fixtures/glob-copy-test");

test("it can glob copy", async () => {
  const files = await globCopy(["images/**", "robot.txt"], DESTINATION_DIR, {
    cwd: SOURCE_DIR
  });

  expect(files).toHaveLength(2);

  expect(files).toEqual(
    expect.arrayContaining(["robot.txt", "images/example.jpg"])
  );

  expect(copy).toHaveBeenCalledTimes(2);

  expect(copy).toHaveBeenCalledWith(
    path.resolve(SOURCE_DIR, "robot.txt"),
    path.resolve(DESTINATION_DIR, "robot.txt")
  );

  expect(copy).toHaveBeenCalledWith(
    path.resolve(SOURCE_DIR, "images/example.jpg"),
    path.resolve(DESTINATION_DIR, "images/example.jpg")
  );
});
