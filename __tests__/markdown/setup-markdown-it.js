/* global expect:false, jest:false, test:false */
const hljs = require("highlight.js");
const markdownIt = require("markdown-it");
const mdAnchor = require("markdown-it-anchor");
const mdToc = require("markdown-it-table-of-contents");

const setupMarkdownIt = require("../../src/markdown/setup-markdown-it");

jest.mock("highlight.js");
jest.mock("markdown-it-anchor");
jest.mock("markdown-it-table-of-contents");

test("it returns MarkdownIt instance", () => {
  const md = setupMarkdownIt();

  expect(md).toBeInstanceOf(markdownIt);
});

test("it can receive markdown-it options", () => {
  const highlight = () => "foo";

  const md = setupMarkdownIt({
    html: true,
    xhtmlOut: true,
    langPrefix: "foo",
    highlight
  });

  expect(md.options).toMatchObject({
    html: true,
    xhtmlOut: true,
    langPrefix: "foo",
    highlight
  });
});

test("it has default markdown-it highlight function", () => {
  const md = setupMarkdownIt();

  expect(md.options.highlight).toBeInstanceOf(Function);
});

test("it uses highlight.js for code highlighting", () => {
  hljs.getLanguage = jest.fn().mockReturnValue("js");
  hljs.highlight = jest.fn().mockReturnValue({
    language: "js",
    value: "foo"
  });

  const md = setupMarkdownIt();

  const result = md.options.highlight("12", "js");

  expect(hljs.getLanguage).toHaveBeenCalledWith("js");
  expect(hljs.highlight).toHaveBeenCalledWith("js", "12", true);
  expect(result).toMatch(/<pre[\s\S]*><code[\s\S]*>[\s\S]*foo/i);
});

test("it uses highlight.js highlightAuto if lang is empty", () => {
  hljs.highlightAuto = jest.fn().mockReturnValue({
    language: "js",
    value: "foo"
  });

  const md = setupMarkdownIt();

  const result = md.options.highlight("12");

  expect(hljs.highlightAuto).toHaveBeenCalledWith("12");
  expect(result).toMatch(/<pre[\s\S]*><code[\s\S]*>[\s\S]*foo/i);
});

test("it registers markdown-it-anchor plugin", () => {
  setupMarkdownIt();

  expect(mdAnchor).toHaveBeenCalled();
});

test("it registers markdown-it-table-of-contents plugin", () => {
  setupMarkdownIt();

  expect(mdToc).toHaveBeenCalled();
});
