/* global expect:false, test:false */
const generateDestinationPath = require("../../src/util/generate-destination-path");

test("it can generate destination path for relative source path", () => {
  const destPath = generateDestinationPath("foo/bar/../baz.txt", {
    source: "/src",
    destination: "/dest"
  });

  expect(destPath).toBe("/dest/foo/baz.txt");
});

test("it can generate destination path for absolute source path", () => {
  const destPath = generateDestinationPath("/src/foo/bar/baz.txt", {
    source: "/src",
    destination: "/dest"
  });

  expect(destPath).toBe("/dest/foo/bar/baz.txt");
});

test("it can override the destination file extension", () => {
  let destPath = generateDestinationPath("foo/bar.md", {
    source: "/src",
    destination: "/dest",
    ext: ".html"
  });

  expect(destPath).toBe("/dest/foo/bar.html");

  destPath = generateDestinationPath("/src/foo/bar.md", {
    source: "/src",
    destination: "/dest",
    ext: "html"
  });

  expect(destPath).toBe("/dest/foo/bar.html");
});

test("it can prepend hash to the destination file", () => {
  let destPath = generateDestinationPath("foo/bar.txt", {
    source: "/src",
    destination: "/dest",
    hash: "test"
  });

  expect(destPath).toBe("/dest/foo/bar.test.txt");

  destPath = generateDestinationPath("/src/foo/bar.txt", {
    source: "/src",
    destination: "/dest",
    hash: "test"
  });

  expect(destPath).toBe("/dest/foo/bar.test.txt");
});

test("it can receive both ext and hash arguments", () => {
  let destPath = generateDestinationPath("foo/bar.md", {
    source: "/src",
    destination: "/dest",
    ext: ".html",
    hash: "test"
  });

  expect(destPath).toBe("/dest/foo/bar.test.html");

  destPath = generateDestinationPath("/src/foo/bar.md", {
    source: "/src",
    destination: "/dest",
    ext: ".html",
    hash: "test"
  });

  expect(destPath).toBe("/dest/foo/bar.test.html");
});
