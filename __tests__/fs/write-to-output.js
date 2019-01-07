/* global expect:false, jest:false, test:false */
const md5 = require("../../src/util/md5");
const writeFile = require("../../src/fs/write-file");
const writeToOutput = require("../../src/fs/write-to-output");

jest.mock("../../src/util/md5");
jest.mock("../../src/fs/write-file");

test("it can write to the output path with relative source path", async () => {
  await writeToOutput("foo bar", {
    source: "./foo/bar/../baz.txt",
    sourceRoot: "/src",
    outputRoot: "/dest"
  });

  expect(writeFile).toHaveBeenCalledWith("/dest/foo/baz.txt", "foo bar");
});

test("it can write to the output path with absolute source path", async () => {
  await writeToOutput("foo bar", {
    source: "/src/foo/bar/baz.txt",
    sourceRoot: "/src",
    outputRoot: "/dest"
  });

  expect(writeFile).toHaveBeenCalledWith("/dest/foo/bar/baz.txt", "foo bar");
});

test("it can override the output file extension", async () => {
  await writeToOutput("foo bar", {
    source: "foo/bar.txt",
    sourceRoot: "/src",
    outputRoot: "/dest",
    ext: ".html"
  });

  expect(writeFile).toHaveBeenCalledWith("/dest/foo/bar.html", "foo bar");
});

test("it can prepend a hash to the output filename", async () => {
  md5.mockReturnValue("1234567890ABCD");

  await writeToOutput("foo bar", {
    source: "foo/bar.txt",
    sourceRoot: "/src",
    outputRoot: "/dest",
    hash: true
  });

  expect(md5).toHaveBeenCalledWith("foo bar");
  expect(writeFile).toHaveBeenCalledWith(
    "/dest/foo/bar.1234567890.txt",
    "foo bar"
  );
});

test("it returns output path", async () => {
  const outputPath = await writeToOutput("foo bar", {
    source: "foo/bar.txt",
    sourceRoot: "/src",
    outputRoot: "/dest"
  });

  expect(outputPath).toBe("/dest/foo/bar.txt");
});
