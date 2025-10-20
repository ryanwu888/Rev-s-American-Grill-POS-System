import React from "react";
import { render } from "@testing-library/react";
import CommonPairings from "../components/productUsage";
import ProductUsage from "../components/productUsage";

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]), // Mock response data
  })
);

describe("Product Usage Component", () => {
  test("renders without crashing", () => {
    render(<ProductUsage />);
    // No need for assertions as long as the component renders without throwing errors
  });
  
});
  