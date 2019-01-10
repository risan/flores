/* global expect:false, jest:false, test:false */
const p = require("path");

const MarkdownParser = require("../../src/markdown/markdown-parser");
const MarkdownProcessor = require("../../src/markdown/markdown-processor");
const writeFile = require("../../src/fs/write-file");

jest.mock("../../src/markdown/markdown-parser");
jest.mock("../../src/fs/write-file");

test("it has source, output, and defaultTemplate properties", () => {
  const markdownProcessor = new MarkdownProcessor({
    source: "/src",
    output: "/dest",
    defaultTemplate: "test.njk"
  });

  expect(markdownProcessor.source).toBe("/src");
  expect(markdownProcessor.output).toBe("/dest");
  expect(markdownProcessor.defaultTemplate).toBe("test.njk");
});

test("it removes trailing slash from base url", () => {
  const markdownProcessor = new MarkdownProcessor({
    baseUrl: "/foo/bar/"
  });

  expect(markdownProcessor.baseUrl).toBe("/foo/bar");
});

test("it has parser property", () => {
  const markdownProcessor = new MarkdownProcessor({
    parserOptions: {
      html: true
    }
  });

  expect(markdownProcessor.parser).toBeInstanceOf(MarkdownParser);
  expect(MarkdownParser).toHaveBeenCalledWith({ html: true });
});

test("it can process all markdown files", async () => {
  const addGlobal = jest.fn();

  const markdownProcessor = new MarkdownProcessor({
    renderer: {
      addGlobal
    }
  });

  markdownProcessor.collectData = jest.fn().mockReturnValue({
    pages: ["page1", "page2"],
    posts: ["post1", "post2"],
    collections: { foo: ["bar"] }
  });

  markdownProcessor.writeHtml = jest.fn();

  const data = await markdownProcessor.processAll();

  expect(markdownProcessor.collectData).toHaveBeenCalled();
  expect(addGlobal).toHaveBeenCalledWith("pages", ["page1", "page2"]);
  expect(addGlobal).toHaveBeenCalledWith("posts", ["post1", "post2"]);
  expect(addGlobal).toHaveBeenCalledWith("collections", { foo: ["bar"] });

  expect(markdownProcessor.writeHtml).toHaveBeenCalledTimes(4);
  expect(markdownProcessor.writeHtml).toHaveBeenCalledWith("page1");
  expect(markdownProcessor.writeHtml).toHaveBeenCalledWith("page2");
  expect(markdownProcessor.writeHtml).toHaveBeenCalledWith("post1");
  expect(markdownProcessor.writeHtml).toHaveBeenCalledWith("post1");

  expect(data).toEqual({
    pages: ["page1", "page2"],
    posts: ["post1", "post2"],
    collections: { foo: ["bar"] }
  });
});

test("it can collect markdown data", async () => {
  const markdownProcessor = new MarkdownProcessor({});

  const test1 = {
    frontMatter: { date: new Date("2018-01-01"), title: "foo" },
    collectionName: "test"
  };

  const test2 = {
    frontMatter: { date: new Date("2018-01-02"), title: "bar" },
    collectionName: "test"
  };

  const testPage = {
    frontMatter: { page: true, title: "test" },
    collectionName: "test"
  };

  const awesome1 = {
    frontMatter: { date: new Date("2018-01-03"), title: "baz" },
    collectionName: "awesome"
  };

  markdownProcessor.parseAllFiles = jest
    .fn()
    .mockReturnValue([test1, test2, testPage, awesome1]);

  const data = await markdownProcessor.collectData();

  expect(data).toHaveProperty("pages");
  expect(data).toHaveProperty("posts");
  expect(data).toHaveProperty("collections");

  expect(data.pages).toEqual([testPage]);

  expect(data.posts).toEqual([awesome1, test2, test1]);

  expect(data.collections).toEqual({
    awesome: [awesome1],
    test: [test2, test1]
  });
});

test("it can write html", async () => {
  const render = jest.fn().mockReturnValue("foo bar");
  const getGlobal = jest.fn().mockReturnValue({ posts: ["test"] });

  const markdownProcessor = new MarkdownProcessor({
    renderer: {
      render,
      getGlobal
    }
  });

  await markdownProcessor.writeHtml({
    frontMatter: {
      template: "foo.njk"
    },
    collectionName: "posts",
    outputPath: "/src/foo.html"
  });

  expect(render).toHaveBeenCalledWith("foo.njk", {
    frontMatter: {
      template: "foo.njk"
    },
    collectionName: "posts",
    outputPath: "/src/foo.html",
    collection: ["test"]
  });

  expect(getGlobal).toHaveBeenCalledWith("collections");

  expect(writeFile).toHaveBeenCalledWith("/src/foo.html", "foo bar");
});

test("it can parse all markdown files", async () => {
  const markdownProcessor = new MarkdownProcessor({});

  markdownProcessor.getFiles = jest.fn().mockReturnValue(["foo.md", "bar.md"]);
  markdownProcessor.parseFile = jest.fn().mockReturnValue({ content: "foo" });

  const data = await markdownProcessor.parseAllFiles();

  expect(markdownProcessor.getFiles).toHaveBeenCalled();
  expect(markdownProcessor.parseFile).toHaveBeenCalledTimes(2);
  expect(markdownProcessor.parseFile).toHaveBeenNthCalledWith(1, "foo.md");
  expect(markdownProcessor.parseFile).toHaveBeenNthCalledWith(2, "bar.md");
  expect(data).toEqual([{ content: "foo" }, { content: "foo" }]);
});

test("it can parse markdown file", async () => {
  const markdownProcessor = new MarkdownProcessor({
    source: p.resolve(__dirname, "../fixtures/src"),
    output: p.resolve(__dirname, "../fixtures/public"),
    baseUrl: "/foo"
  });

  markdownProcessor.parser.parseFile = jest.fn().mockReturnValue({
    frontMatter: {
      title: "Foo"
    },
    html: "foo"
  });

  const data = await markdownProcessor.parseFile("posts/foo.md");

  expect(data).toMatchObject({
    frontMatter: {
      title: "Foo"
    },
    content: "foo",
    url: "/foo/posts/foo.html",
    collectionName: "posts"
  });

  expect(data.outputPath).toMatch(/\/posts\/foo\.html$/);
});

test("it can get url for output path", () => {
  const markdownProcessor = new MarkdownProcessor({
    baseUrl: "/foo",
    output: "/dest"
  });

  expect(markdownProcessor.getUrlForOutputPath("bar/baz.html")).toBe(
    "/foo/bar/baz.html"
  );
  expect(markdownProcessor.getUrlForOutputPath("/dest/bar/baz.html")).toBe(
    "/foo/bar/baz.html"
  );
});

test("it can get all markdown files", async () => {
  const markdownProcessor = new MarkdownProcessor({
    source: p.resolve(__dirname, "../fixtures/src")
  });

  const files = await markdownProcessor.getFiles();

  expect(files).toEqual(
    expect.arrayContaining(["about.md", "posts/bar.md", "posts/foo.md"])
  );
});
