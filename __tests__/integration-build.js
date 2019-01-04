/* global beforeAll:false, expect:false, test:false */
const path = require("path");

const fs = require("fs-extra");
const { JSDOM } = require("jsdom");

const build = require("../src/build");

const BASE_PATH = path.resolve(__dirname, "fixtures");
const OUTPUT_PATH = path.resolve(BASE_PATH, "public");
const CSS_FILENAME = "main.97c08d7946.css";

const outputPath = (p = "/") => path.resolve(OUTPUT_PATH, p);

const outputPathExists = (p = "") => fs.pathExistsSync(outputPath(p));

beforeAll(async () => {
  await build({
    env: "production",
    url: "http://example.com/blog",
    basePath: BASE_PATH
  });
});

test("it can convert markdown files into HTML", () => {
  expect(outputPathExists("index.html")).toBe(true);
  expect(outputPathExists("about.html")).toBe(true);
  expect(outputPathExists("posts/index.html")).toBe(true);
  expect(outputPathExists("posts/foo.html")).toBe(true);
  expect(outputPathExists("posts/bar.html")).toBe(true);
  expect(outputPathExists("tests/markdown-parser-test.html")).toBe(true);
});

test("it can parse markdown properly", async () => {
  const html = await fs.readFile(
    outputPath("tests/markdown-parser-test.html"),
    "utf8"
  );

  const { document } = new JSDOM(html).window;

  expect(document.querySelector("h2").textContent).toMatch(
    /Markdown Parser Test/i
  );
  expect(document.querySelector("p").textContent).toMatch(/paragraph/i);

  const link = document.querySelectorAll("a")[1];
  expect(link.textContent).toMatch(/link/i);
  expect(link.href).toMatch(/example\.com/i);

  expect(document.querySelector("strong").textContent).toMatch(/bold/i);
  expect(document.querySelector("em").textContent).toMatch(/italic/i);

  let list = document.querySelectorAll("ul > li");
  expect(list[0].textContent).toMatch("li1");
  expect(list[1].textContent).toMatch("li2");

  list = document.querySelectorAll("ol > li");
  expect(list[0].textContent).toMatch("li1");
  expect(list[1].textContent).toMatch("li2");

  expect(document.querySelector("blockquote").textContent).toMatch(
    /blockquote/i
  );

  const img = document.querySelector("img");
  expect(img.src).toMatch(/example\.com/i);
  expect(img.alt).toMatch(/alt image/i);

  expect(document.querySelector("pre").textContent).toMatch(/code/i);
  expect(document.querySelector("p > code").textContent).toMatch(/code/i);
});

test("it can generate collection page", async () => {
  const html = await fs.readFile(outputPath("posts/index.html"), "utf8");

  const { document } = new JSDOM(html).window;

  const lists = document.querySelectorAll("li");
  expect(lists).toHaveLength(2);

  const links = document.querySelectorAll("li > a");
  expect(links[0].textContent).toMatch(/bar/i);
  expect(links[0].href).toBe("http://example.com/blog/posts/bar.html");
  expect(links[1].textContent).toMatch(/foo/i);
  expect(links[1].href).toBe("http://example.com/blog/posts/foo.html");
});

test("it can access front matter from the template", async () => {
  const html = await fs.readFile(outputPath("about.html"), "utf8");

  const { document } = new JSDOM(html).window;

  expect(document.querySelector("h1").textContent).toMatch(/About/i);
});

test("it can use custom template", async () => {
  const html = await fs.readFile(outputPath("index.html"), "utf8");

  const { document } = new JSDOM(html).window;

  expect(document.querySelector("h1").textContent).toMatch(/Index Template/i);
});

test("it can process css file", async () => {
  expect(outputPathExists(`assets/${CSS_FILENAME}`)).toBe(true);

  const css = await fs.readFile(outputPath(`assets/${CSS_FILENAME}`), "utf8");

  expect(css).toMatch(
    /body\{font-size:16px;font-family:monospace;background:#fafafa\}/i
  );
});

test("it can access front matter from the template", async () => {
  const html = await fs.readFile(outputPath("posts/foo.html"), "utf8");

  const { document } = new JSDOM(html).window;

  expect(document.querySelector("link").href).toBe(
    `/blog/assets/${CSS_FILENAME}`
  );
});

test("it can copy static file", () => {
  expect(outputPathExists("robot.txt")).toBe(true);
  expect(outputPathExists("images/example.jpg")).toBe(true);
});

test("it can generate sitemap", async () => {
  expect(outputPathExists("sitemap.xml")).toBe(true);

  const sitemap = await fs.readFile(outputPath("sitemap.xml"), "utf8");

  expect(sitemap).toMatch(/http:\/\/example.com\/blog\/posts\/foo.html/i);
  expect(sitemap).toMatch(/http:\/\/example.com\/blog\/posts\/bar.html/i);
});
