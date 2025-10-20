import React from "react";
import { render } from "@testing-library/react";
import CommonPairings from "../components/commonPairings";

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]), // Mock response data
  })
);

describe("CommonPairings Component", () => {
  test("renders without crashing", () => {
    render(<CommonPairings />);
    // No need for assertions as long as the component renders without throwing errors
  });
});
