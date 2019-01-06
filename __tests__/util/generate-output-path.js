/* global expect:false, test:false */
const generateOutputPath = require("../../src/util/generate-output-path");

test("it can generate output path for relative source path", () => {
  const outputPath = generateOutputPath("foo/bar/../baz.txt", {
    sourceRoot: "/src",
    outputRoot: "/dest"
  });

  expect(outputPath).toBe("/dest/foo/baz.txt");
});

test("it can generate output path for absolute source path", () => {
  const outputPath = generateOutputPath("/src/foo/bar/baz.txt", {
    sourceRoot: "/src",
    outputRoot: "/dest"
  });

  expect(outputPath).toBe("/dest/foo/bar/baz.txt");
});

test("it can override the output file extension", () => {
  let outputPath = generateOutputPath("foo/bar.md", {
    sourceRoot: "/src",
    outputRoot: "/dest",
    ext: ".html"
  });

  expect(outputPath).toBe("/dest/foo/bar.html");

  outputPath = generateOutputPath("/src/foo/bar.md", {
    sourceRoot: "/src",
    outputRoot: "/dest",
    ext: "html"
  });

  expect(outputPath).toBe("/dest/foo/bar.html");
});

test("it can prepend hash to the output file", () => {
  let outputPath = generateOutputPath("foo/bar.txt", {
    sourceRoot: "/src",
    outputRoot: "/dest",
    hash: "test"
  });

  expect(outputPath).toBe("/dest/foo/bar.test.txt");

  outputPath = generateOutputPath("/src/foo/bar.txt", {
    sourceRoot: "/src",
    outputRoot: "/dest",
    hash: "test"
  });

  expect(outputPath).toBe("/dest/foo/bar.test.txt");
});

test("it can receive both ext and hash arguments", () => {
  let outputPath = generateOutputPath("foo/bar.md", {
    sourceRoot: "/src",
    outputRoot: "/dest",
    ext: ".html",
    hash: "test"
  });

  expect(outputPath).toBe("/dest/foo/bar.test.html");

  outputPath = generateOutputPath("/src/foo/bar.md", {
    sourceRoot: "/src",
    outputRoot: "/dest",
    ext: ".html",
    hash: "test"
  });

  expect(outputPath).toBe("/dest/foo/bar.test.html");
});
