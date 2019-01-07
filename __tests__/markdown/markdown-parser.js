/* global expect:false, test:false */
const p = require("path");

const redent = require("redent");

const MarkdownParser = require("../../src/markdown/markdown-parser");

test("it can parse markdown data", () => {
  const markdownParser = new MarkdownParser();

  const result = markdownParser.parse(
    redent(`
    ---
    title: Hello World
    awesome: true
    ---
    ## Hello World!
  `).trim()
  );

  expect(result.frontMatter).toEqual({
    title: "Hello World",
    awesome: true
  });

  expect(result.html).toMatch(/<h2[\s\S]*>[\s\S]*Hello World!/i);
});

test("it can parse markdown file", async () => {
  const markdownParser = new MarkdownParser();

  const result = await markdownParser.parseFile(
    p.resolve(__dirname, "../fixtures/src/about.md")
  );

  expect(result.frontMatter).toEqual({
    title: "About",
    date: new Date("2018-01-01 06:00:00+00:00")
  });

  expect(result.html).toMatch(/<p[\s\S]*>[\s\S]*About/i);
});
