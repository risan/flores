/* global expect:false, test:false */
const minifyHtml = require("../../src/util/minify-html");

test("it can minify HTML", () => {
  const result = minifyHtml(`
    <html>
      <body>
        Foo
      </body>
    </html>
  `);

  expect(result).toBe("<html><body>Foo</body></html>");
});
