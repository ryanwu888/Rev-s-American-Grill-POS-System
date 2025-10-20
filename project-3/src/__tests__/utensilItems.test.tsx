import React from "react";
import { render } from "@testing-library/react";
import UtensilItems from "../components/utensilItems";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]), // Mock response data
  })
);

describe("Product Usage Component", () => {
  test("renders without crashing", () => {
    render(<UtensilItems />);
    // No need for assertions as long as the component renders without throwing errors
  });
});
