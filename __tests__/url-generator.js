/* global expect:false, test:false */
const { URL } = require("url");

const UrlGenerator = require("../src/url-generator");

test("it has url property", () => {
  const url = new URL("http://example.com");

  const urlGenerator = new UrlGenerator(url);

  expect(urlGenerator.url).toBeInstanceOf(URL);
  expect(urlGenerator.url).toBe(url);
});

test("it can receive url as a string", () => {
  const urlGenerator = new UrlGenerator("http://example.com");

  expect(urlGenerator.url).toBeInstanceOf(URL);
  expect(urlGenerator.url.toString()).toBe("http://example.com/");
});

test("it can generate absolute url", () => {
  let url = new UrlGenerator("http://example.com");

  expect(url.to("/")).toBe("http://example.com/");
  expect(url.to("foo")).toBe("http://example.com/foo");
  expect(url.to("/foo")).toBe("http://example.com/foo");
  expect(url.to("/foo/")).toBe("http://example.com/foo/");
  expect(url.to("/foo/bar")).toBe("http://example.com/foo/bar");

  url = new UrlGenerator("http://example.com/test");

  expect(url.to("/")).toBe("http://example.com/test/");
  expect(url.to("foo")).toBe("http://example.com/test/foo");
  expect(url.to("/foo")).toBe("http://example.com/test/foo");
  expect(url.to("/foo/")).toBe("http://example.com/test/foo/");
  expect(url.to("/foo/bar")).toBe("http://example.com/test/foo/bar");

  url = new UrlGenerator("http://example.com/test/");

  expect(url.to("/")).toBe("http://example.com/test/");
  expect(url.to("foo")).toBe("http://example.com/test/foo");
  expect(url.to("/foo")).toBe("http://example.com/test/foo");
  expect(url.to("/foo/")).toBe("http://example.com/test/foo/");
  expect(url.to("/foo/bar")).toBe("http://example.com/test/foo/bar");
});

test("it can generate relative url", () => {
  let url = new UrlGenerator("http://example.com");

  expect(url.relative("/")).toBe("/");
  expect(url.relative("foo")).toBe("/foo");
  expect(url.relative("/foo")).toBe("/foo");
  expect(url.relative("/foo/")).toBe("/foo/");
  expect(url.relative("/foo/bar")).toBe("/foo/bar");

  url = new UrlGenerator("http://example.com/test");

  expect(url.relative("/")).toBe("/test/");
  expect(url.relative("foo")).toBe("/test/foo");
  expect(url.relative("/foo")).toBe("/test/foo");
  expect(url.relative("/foo/")).toBe("/test/foo/");
  expect(url.relative("/foo/bar")).toBe("/test/foo/bar");

  url = new UrlGenerator("http://example.com/test/");

  expect(url.relative("/")).toBe("/test/");
  expect(url.relative("foo")).toBe("/test/foo");
  expect(url.relative("/foo")).toBe("/test/foo");
  expect(url.relative("/foo/")).toBe("/test/foo/");
  expect(url.relative("/foo/bar")).toBe("/test/foo/bar");
});
