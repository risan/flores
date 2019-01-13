/* global expect:false, jest:false, test:false */
const sm = require("sitemap");

const SitemapGenerator = require("../src/sitemap-generator");
const writeFile = require("../src/fs/write-file");

jest.mock("sitemap");
jest.mock("../src/fs/write-file");

test("it has output property", () => {
  const sitemapGenerator = new SitemapGenerator({ output: "/dest" });

  expect(sitemapGenerator.output).toBe("/dest");
});

test("it can generate sitemap", async () => {
  const sitemapGenerator = new SitemapGenerator({ output: "/dest" });

  sm.createSitemap = jest.fn().mockReturnValue("foo");

  await sitemapGenerator.generate({
    posts: [
      {
        url: "http://example.com/posts/foo.html",
        frontMatter: {
          date: new Date("2019-01-01T07:00:00.000Z")
        }
      },
      {
        url: "http://example.com/posts/bar.html",
        frontMatter: {
          date: new Date("2019-01-02T07:00:00.000Z"),
          sitemap: {
            changefreq: "monthly"
          }
        }
      },
      {
        url: "http://example.com/posts/baz.html",
        frontMatter: {
          date: new Date("2019-01-03T07:00:00.000Z"),
          sitemap: false
        }
      }
    ],
    pages: [
      {
        url: "http://example.com/index.html"
      }
    ]
  });

  expect(sm.createSitemap).toHaveBeenCalledWith({
    urls: [
      {
        changefreq: "daily",
        url: "http://example.com/index.html"
      },
      {
        url: "http://example.com/posts/foo.html",
        lastmodISO: "2019-01-01T07:00:00.000Z"
      },
      {
        changefreq: "monthly",
        url: "http://example.com/posts/bar.html",
        lastmodISO: "2019-01-02T07:00:00.000Z"
      }
    ]
  });

  expect(writeFile).toHaveBeenCalledWith("/dest/sitemap.xml", "foo");
});

test("formatItem should return null if sitemap set to false", () => {
  const item = SitemapGenerator.formatItem({
    frontMatter: { sitemap: false }
  });

  expect(item).toBeNull();
});

test("formatItem can merge defaultValue parameter", () => {
  const item = SitemapGenerator.formatItem(
    {
      url: "http://example.com"
    },
    {
      changefreq: "daily"
    }
  );

  expect(item).toEqual({
    url: "http://example.com",
    changefreq: "daily"
  });
});

test("formatItem can merge frontMatter.sitemap option", () => {
  const item = SitemapGenerator.formatItem({
    url: "http://example.com",
    frontMatter: {
      sitemap: { changefreq: "monthly" }
    }
  });

  expect(item).toEqual({
    url: "http://example.com",
    changefreq: "monthly"
  });
});

test("formatItem use frontMatter.modifiedAt for lastmodISO", () => {
  const item = SitemapGenerator.formatItem({
    url: "http://example.com",
    frontMatter: {
      date: new Date("2018-01-01T07:00:00.000Z"),
      modifiedAt: new Date("2019-01-01T07:00:00.000Z")
    }
  });

  expect(item).toEqual({
    url: "http://example.com",
    lastmodISO: "2019-01-01T07:00:00.000Z"
  });
});

test("formatItem use frontMatter.date for lastmodISO if frontMatter.modifiedAt is missing", () => {
  const item = SitemapGenerator.formatItem({
    url: "http://example.com",
    frontMatter: {
      date: new Date("2018-01-01T07:00:00.000Z")
    }
  });

  expect(item).toEqual({
    url: "http://example.com",
    lastmodISO: "2018-01-01T07:00:00.000Z"
  });
});
