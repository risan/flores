/* global expect:false, test:false */
const p = require("path");

const nunjucks = require("nunjucks");
const redent = require("redent");

const Renderer = require("../src/renderer");

test("it has env and minify property", () => {
  const renderer = new Renderer({ minify: true });

  expect(renderer.env).toBeInstanceOf(nunjucks.Environment);
  expect(renderer.minify).toBe(true);
});

test("it can add and get global data", () => {
  const renderer = new Renderer();

  renderer.addGlobal("foo", "bar");

  expect(renderer.getGlobal("foo")).toBe("bar");
});

test("it can add filter", () => {
  const renderer = new Renderer();

  const foo = () => "bar";

  renderer.addFilter("foo", foo);

  expect(renderer.env.getFilter("foo")).toBe(foo);
});

test("it can render template", () => {
  const renderer = new Renderer({
    templatesPath: p.resolve(__dirname, "./fixtures/src/templates")
  });

  const html = renderer.render("renderer-test.njk", {
    title: "Hello World",
    content: "<p>lorem ipsum</p>"
  });

  expect(html).toBe(
    `${redent(`
    <html>
    <body>
      <h1>Hello World</h1>
      <p>lorem ipsum</p>
    </body>
    </html>
  `).trim()}\n`
  );
});

test("it can minify html", () => {
  const renderer = new Renderer({
    templatesPath: p.resolve(__dirname, "./fixtures/src/templates"),
    minify: true
  });

  const html = renderer.render("renderer-test.njk", {
    title: "Hello World",
    content: "<p>lorem ipsum</p>"
  });

  expect(html).toBe(
    "<html><body><h1>Hello World</h1><p>lorem ipsum</p></body></html>"
  );
});

test("it can append scripts", () => {
  const renderer = new Renderer({
    templatesPath: p.resolve(__dirname, "./fixtures/src/templates"),
    appendScripts: ["/foo.js", "/bar.js"]
  });

  const html = renderer.render("renderer-test.njk", {
    title: "Hello World",
    content: "<p>lorem ipsum</p>"
  });

  expect(html).toContain(
    '<script src="/foo.js"></script><script src="/bar.js"></script></body>'
  );
});

test("it can clear the cache", () => {
  const renderer = new Renderer();

  renderer.env.loaders = [{ cache: { foo: "bar" } }];

  renderer.clearCache();

  expect(renderer.env.loaders).toEqual([{ cache: {} }]);
});
