/* global expect:false, test:false */
const Processor = require("postcss/lib/processor");

const setupPostcss = require("../../src/css/setup-postcss");

test("it can setup postcss", () => {
  const processor = setupPostcss({
    importPaths: ["foo"],
    presetEnvOptions: {
      stage: 0
    }
  });

  expect(processor).toBeInstanceOf(Processor);
  expect(processor.plugins).toHaveLength(2);
  expect(processor.plugins[0].postcssPlugin).toBe("postcss-import");
  expect(processor.plugins[1].postcssPlugin).toBe("postcss-preset-env");
});

test("it uses cssnano plugin if minify set to true", () => {
  const processor = setupPostcss({
    importPaths: ["foo"],
    presetEnvOptions: {
      stage: 0
    },
    minify: true
  });

  expect(processor).toBeInstanceOf(Processor);
  expect(processor.plugins).toHaveLength(3);
  expect(processor.plugins[2].postcssPlugin).toBe("cssnano");
});
