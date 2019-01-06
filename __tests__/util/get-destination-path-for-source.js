/* global expect:false, test:false */
const getDestinationPathForSource = require("../../src/util/get-destination-path-for-source");

test("it can get destination path for relative source path", () => {
  const destPath = getDestinationPathForSource("foo/bar/../baz.txt", {
    source: "/src",
    destination: "/dest"
  });

  expect(destPath).toBe("/dest/foo/baz.txt");
});

test("it can get destination path for absolute source path", () => {
  const destPath = getDestinationPathForSource("/src/foo/bar/baz.txt", {
    source: "/src",
    destination: "/dest"
  });

  expect(destPath).toBe("/dest/foo/bar/baz.txt");
});

test("it can override the destination file extension", () => {
  let destPath = getDestinationPathForSource("foo/bar.md", {
    source: "/src",
    destination: "/dest",
    ext: ".html"
  });

  expect(destPath).toBe("/dest/foo/bar.html");

  destPath = getDestinationPathForSource("/src/foo/bar.md", {
    source: "/src",
    destination: "/dest",
    ext: "html"
  });

  expect(destPath).toBe("/dest/foo/bar.html");
});

test("it can prepend hash to the destination file", () => {
  let destPath = getDestinationPathForSource("foo/bar.txt", {
    source: "/src",
    destination: "/dest",
    hash: "test"
  });

  expect(destPath).toBe("/dest/foo/bar.test.txt");

  destPath = getDestinationPathForSource("/src/foo/bar.txt", {
    source: "/src",
    destination: "/dest",
    hash: "test"
  });

  expect(destPath).toBe("/dest/foo/bar.test.txt");
});

test("it can receive both ext and hash arguments", () => {
  let destPath = getDestinationPathForSource("foo/bar.md", {
    source: "/src",
    destination: "/dest",
    ext: ".html",
    hash: "test"
  });

  expect(destPath).toBe("/dest/foo/bar.test.html");

  destPath = getDestinationPathForSource("/src/foo/bar.md", {
    source: "/src",
    destination: "/dest",
    ext: ".html",
    hash: "test"
  });

  expect(destPath).toBe("/dest/foo/bar.test.html");
});
