/* global expect:false, jest:false, test:false */
const path = require("path");

const copy = require("../../src/fs/copy");
const globCopy = require("../../src/fs/glob-copy");

jest.mock("../../src/fs/copy");

const SOURCE_ROOT = path.resolve(__dirname, "../fixtures/src");
const DESTINATION_ROOT = path.resolve(__dirname, "../fixtures/glob-copy-test");

test("it can glob copy", async () => {
  const files = await globCopy(["images/**", "robot.txt"], DESTINATION_ROOT, {
    cwd: SOURCE_ROOT
  });

  expect(files).toHaveLength(2);

  expect(files).toEqual(
    expect.arrayContaining(["robot.txt", "images/example.jpg"])
  );

  expect(copy).toHaveBeenCalledTimes(2);

  expect(copy).toHaveBeenCalledWith(
    path.resolve(SOURCE_ROOT, "robot.txt"),
    path.resolve(DESTINATION_ROOT, "robot.txt")
  );

  expect(copy).toHaveBeenCalledWith(
    path.resolve(SOURCE_ROOT, "images/example.jpg"),
    path.resolve(DESTINATION_ROOT, "images/example.jpg")
  );
});
