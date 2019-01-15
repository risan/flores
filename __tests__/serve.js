/* global beforeEach:false, expect:false, jest:false, test:false */
/* eslint no-console: "off" */
const { URL } = require("url");

const createServer = require("../src/create-server");
const Processor = require("../src/processor");
const serve = require("../src/serve");

jest.mock("../src/create-server");
jest.mock("../src/processor");

const processMock = jest.fn();
const listenMock = jest.fn();

const processorMock = {
  process: processMock,
  config: {
    output: "/dest",
    url: new URL("http://localhost:4000/")
  }
};

beforeEach(() => {
  Processor.mockImplementation(() => processorMock);

  createServer.mockImplementation(() => ({
    listen: listenMock
  }));
});

test("it can receive configuration options", async () => {
  await serve({ output: "/foo" });

  expect(Processor).toHaveBeenCalledWith({
    output: "/foo",
    env: "development"
  });
});

test("the env will always be set to development", async () => {
  await serve({ env: "production" });

  expect(Processor).toHaveBeenCalledWith({ env: "development" });
});

test("it can build the website", async () => {
  await serve();

  expect(processMock).toHaveBeenCalled();
});

test("it can start the server", async () => {
  console.log = jest.fn();

  await serve();

  expect(createServer).toHaveBeenCalledWith({ root: "/dest" });
  expect(listenMock.mock.calls[0][0]).toEqual("4000");

  listenMock.mock.calls[0][1]();
  expect(console.log).toHaveBeenCalled();
});

test("it returns Processor instance", async () => {
  const processor = await serve();

  expect(processor).toBe(processorMock);
});
