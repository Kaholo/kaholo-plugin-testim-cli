const { hello } = require("./app");

test("hello greets properly", () => {
  expect(hello("Kaholo")).toBe("hello Kaholo");
});
