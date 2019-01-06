/* global expect:false, jest:false, test:false */
const copy = require("../src/fs/copy");
const globCopy = require("../src/fs/glob-copy");
const StaticFileProcessor = require("../src/static-file-processor");

jest.mock("../src/fs/copy");
jest.mock("../src/fs/glob-copy");

test("it can access patterns, source, and destination properties", () => {
  const staticFileProcessor = new StaticFileProcessor({
    patterns: "**/*.html",
    source: "/src",
    destination: "/dest"
  });

  expect(staticFileProcessor.patterns).toBe("**/*.html");
  expect(staticFileProcessor.source).toBe("/src");
  expect(staticFileProcessor.destination).toBe("/dest");
});

test("it has default patterns value", () => {
  const staticFileProcessor = new StaticFileProcessor({
    destination: "/dest"
  });

  expect(Array.isArray(staticFileProcessor.patterns)).toBe(true);
  expect(staticFileProcessor.patterns.length > 0).toBe(true);
});

test("it has default source value", () => {
  const staticFileProcessor = new StaticFileProcessor({
    destination: "/dest"
  });

  expect(staticFileProcessor.source).toBe(process.cwd());
});

test("it can copy all static files", async () => {
  const staticFileProcessor = new StaticFileProcessor({
    patterns: "**/*.html",
    source: "/src",
    destination: "/dest"
  });

  globCopy.mockReturnValue(["foo"]);

  const files = await staticFileProcessor.copyAll();

  expect(globCopy).toHaveBeenCalledWith("**/*.html", "/dest", { cwd: "/src" });
  expect(files).toEqual(["foo"]);
});

test("it can copy relative source file to destination", async () => {
  const staticFileProcessor = new StaticFileProcessor({
    source: "/src",
    destination: "/dest"
  });

  copy.mockReturnValue("foo");

  await staticFileProcessor.copy("./foo");

  expect(copy).toHaveBeenCalledWith("/src/foo", "/dest/foo");
});

test("it can copy absolute source file to destination", async () => {
  const staticFileProcessor = new StaticFileProcessor({
    source: "/src",
    destination: "/dest"
  });

  copy.mockReturnValue("foo");

  await staticFileProcessor.copy("/src/foo");

  expect(copy).toHaveBeenCalledWith("/src/foo", "/dest/foo");
});

test("it can get destination path for source file", async () => {
  const staticFileProcessor = new StaticFileProcessor({
    source: "/src",
    destination: "/dest"
  });

  expect(staticFileProcessor.getDestinationPathForSource("./foo")).toBe(
    "/dest/foo"
  );

  expect(
    staticFileProcessor.getDestinationPathForSource("./foo/bar/../baz.txt")
  ).toBe("/dest/foo/baz.txt");

  expect(
    staticFileProcessor.getDestinationPathForSource("/src/foo/bar.txt")
  ).toBe("/dest/foo/bar.txt");
});
