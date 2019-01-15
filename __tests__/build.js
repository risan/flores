/* global beforeEach:false, expect:false, jest:false, test:false */
const build = require("../src/build");
const Processor = require("../src/processor");

jest.mock("../src/processor");

const processMock = jest.fn();

const processorMock = {
  process: processMock,
  config: {
    output: "/dest",
    url: new URL("http://localhost:4000/")
  }
};

beforeEach(() => {
  Processor.mockImplementation(() => processorMock);
});

test("it can receive configuration options", async () => {
  await build();
  expect(Processor).toHaveBeenCalledWith({});

  await build({ foo: "bar" });
  expect(Processor).toHaveBeenCalledWith({ foo: "bar" });
});

test("it can build the website", async () => {
  await build();

  expect(processMock).toHaveBeenCalled();
});

test("it returns Processor instance", async () => {
  const processor = await build();

  expect(processor).toBe(processorMock);
});
