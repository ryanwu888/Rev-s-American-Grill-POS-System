import React from "react";
import { render } from "@testing-library/react";
import KitchenOrderPic from "../components/kitchenOrderPic";

describe("Product Usage Component", () => {
  test("renders without crashing", () => {
    render(<KitchenOrderPic />);
    // No need for assertions as long as the component renders without throwing errors
  });
});
