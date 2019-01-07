/* global expect:false, jest:false, test:false */
const build = require("../src/build");
const Processor = require("../src/processor");

jest.mock("../src/processor");

test("it can receive configuration options", async () => {
  await build();
  expect(Processor).toHaveBeenCalledWith({});

  await build({ foo: "bar" });
  expect(Processor).toHaveBeenCalledWith({ foo: "bar" });
});

test("it can build the website", async () => {
  await build();

  const processor = Processor.mock.instances[0];
  expect(processor.process).toHaveBeenCalled();
});

test("it returns Processor instance", async () => {
  const processor = await build();

  expect(processor).toBeInstanceOf(Processor);
});
